using NetCoreGameServer.Data.Model;

namespace NetCoreGameServer.Service;

public class MobGenerator
{
    private static int NextMobId = 1;
    private static readonly Random r = new();
    public static List<Mob> GenerateMobs(User user)
    {
        if (r.Next(100) < 75)
        {
            return new List<Mob>();
        }
        var maxMobs = Math.Max(3, user.Group?.Users.Count ?? 2 * 2 - 1);
        var numMobs = r.Next(maxMobs)+1;
        var positions = Enumerable.Range(0, 9).ToList();
        return Enumerable.Range(0, numMobs).Select(x =>
        {
            var pos = positions[r.Next(positions.Count)];
            positions.Remove(pos);
            return new Mob
            {
                Id = NextMobId++,
                Position = pos,
                Image = r.Next(101),
                Damage = new[] { 0, 0 },
                Life = 100,
                MaxLife = 100,
                Weapon = ItemSubType.Fire
            };
        }).ToList();
    }
}