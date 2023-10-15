using NetCoreGameServer.Websocket;
using Newtonsoft.Json;
using Org.BouncyCastle.Asn1.X509;

namespace NetCoreGameServer.Data.Model;

public class Mob
{
    private static Random r = new();

    public int Id { get; set; }
    public int Image { get; set; }
    public int Position { get; set; }
    public int Life { get; set; }
    public int MaxLife { get; set; }
    
    public ItemSubType Weapon { get; set; }

    [JsonIgnore]
    public int Level { get; set; }
    [JsonIgnore]
    public long LastAction { get; set; }
    [JsonIgnore]
    public int[] Damage { get; set; }
    [JsonIgnore]
    public int AttackSpeed { get; set; }

    public bool ShouldAttack(long tick)
    {
        return LastAction + AttackSpeed < tick && Life > 0;
    }

    public (Attack? attack, User? target) GetNextAction(Group group, long tick)
    {
        if (!ShouldAttack(tick)) return (null, null);

        var possibleTargets = group.Users.Where(x => x.User.SelectedCharacter is { Zone: Zone.Catacombs }).Select(x => x.User).ToList();//Life: > 0
        if (!possibleTargets.Any()) return (null, null);

        var target = possibleTargets[r.Next(possibleTargets.Count)];
        var attack = Attack(target);

        return (attack, target);
    }

    public Attack? GetNextAction(GameSession session, long tick)
    {
        if (!ShouldAttack(tick)) return null;
        if (session.User.SelectedCharacter is not { Zone: Zone.Catacombs }) return null;

        return Attack(session.User);
    }

    private Attack Attack(User target)
    {
        var dmg = Math.Min(target.SelectedCharacter!.Life, r.Next(Damage[0], Damage[1] + 1));
        target.SelectedCharacter.Life -= dmg;
        var now = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
        if (now - LastAction < AttackSpeed * 2)
        {
            LastAction += AttackSpeed;
        }
        else
        {
            LastAction = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
        }
        return new Attack
        {
            Damage = dmg,
            IsCritical = false,
            SourceId = Id,
            TargetId = target.SelectedCharacter.Id,
            TargetHealthResult = target.SelectedCharacter.Life,
            WeaponType = Weapon,
            Timestamp = LastAction,
            Type = AttackType.MobAttack
        };
    }
}