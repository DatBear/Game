namespace NetCoreGameServer.Data.Model;

public class SkillAction
{
    public int? Counter { get; set; }
    public long Expires { get; set; }

    public bool IsExpired(long tick)
    {
        return Expires < tick;
    }
}