using Newtonsoft.Json;
using Org.BouncyCastle.Asn1.Ocsp;
using System.Diagnostics.Metrics;

namespace NetCoreGameServer.Data.Model;

public class SkillState
{
    [JsonIgnore]
    private static Random r = new();
    [JsonIgnore]
    private const int SkillInterval = 1500;
    [JsonIgnore]
    private Dictionary<SkillType, int> _skillCounters = new()
    {
        { SkillType.Fishing, 0 },
        { SkillType.Cooking, 0 }
    };


    public SkillType Type { get; set; }
    public bool IsCompleted { get; set; }
    public Item? CompletedItem { get; set; }
    public int[] Progress { get; set; }
    public SkillAction? NextAction { get; set; }

    [JsonIgnore]
    public bool HasActioned { get; set; }
    [JsonIgnore]
    public int? Counter { get; set; }
    [JsonIgnore]
    public List<Item> InputItems { get; set; } = new();
    [JsonIgnore]
    public int? Level { get; set; }

    public bool Update(long tick)
    {
        if (!(NextAction?.IsExpired(tick) ?? true)) return false;

        if (IsWon() || IsLost())
        {
            return false;
        }

        switch (Type)
        {
            case SkillType.Fishing:
                if (NextAction != null)
                {
                    //todo base difficulty on level / prof
                    var successful = HasActioned && NextAction.Counter == Counter; 
                    var isCounter = NextAction.Counter != null;
                    if (successful)
                    {
                        Progress[0] -= 5;
                        Progress[1] += isCounter ? 5 : 10;
                    }
                    else
                    {
                        Progress[0] -= isCounter ? 10 : 5;
                    }

                    HasActioned = false;
                    Counter = null;
                }

                if (IsWon() || IsLost())
                {
                    IsCompleted = true;
                    return true;
                }

                var counter = r.Next(3) == 0 ? _skillCounters[Type] : (int?)null;
                var expires = NextAction != null && tick - NextAction.Expires < SkillInterval * 2 ? NextAction.Expires + SkillInterval : tick+SkillInterval;
                NextAction = new SkillAction
                {
                    Counter = counter,
                    Expires = expires
                };
                break;
        }

        return true;
    }

    public bool IsLost()
    {
        return Progress[0] <= 0;
    }

    public bool IsWon()
    {
        return Progress[1] >= 100;
    }

    public void Stop()
    {
        IsCompleted = true;
    }

}