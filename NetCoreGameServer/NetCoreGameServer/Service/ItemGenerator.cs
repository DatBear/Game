using NetCoreGameServer.Data.GameData;
using NetCoreGameServer.Data.Model;

namespace NetCoreGameServer.Service;

public class ItemGenerator
{
    private static Random r = new Random();
    private static int DropChance = 100;
    private static int NextId = 1;

    public static Item? Generate(Group group, Character killer, Mob mob)
    {
        if (r.Next(100) > DropChance)
        {
            return null;
        }

        var maxTier = (int)Math.Round((group?.Users.Average(x => x.User.SelectedCharacter?.Level) ?? killer.Level) / 5d, 0) + 1;
        var tier = r.Next(maxTier)+1;
        var randomSubType = (ItemSubType) r.Next((int)ItemSubType.Essence + 1);//todo change this, fish/glyphs/maps/etc. can't drop
        var numStats = RandomWeightedStatAmount();
        var possibleStats = randomSubType == ItemSubType.Map ? Enum.GetValues<ItemStat>().ToList() : Enum.GetValues<ItemStat>().Take((int)ItemStat.Jubilance + 1).ToList();
        var stats = new List<ItemStat>();
        var itemStats = new ItemStats();
        for (int i = 0; i < numStats; i++)
        {
            var statIdx = r.Next(possibleStats.Count());
            var stat = possibleStats[statIdx];
            stats.Add(stat);
            possibleStats.RemoveAt(statIdx);
            var prop = itemStats.GetType().GetProperty(stat.ToString());
            if (prop != null)
            {
                var val = Math.Max(1, r.Next(0, ItemStatValues.MaxPerTier[stat] * tier));
                prop.SetValue(itemStats, val);//todo don't use reflection
            }
        }

        var item = new Item
        {
            Id = NextId++,
            Stats = itemStats,
            Tier = tier,
            SubType = randomSubType
        };
        return item;
    }

    private static int RandomWeightedStatAmount()
    {
        var rand = r.Next(1000);
        return rand switch
        {
            < 1 => 0,//500
            < 700 => 1,
            < 800 => 2,
            < 900 => 3,
            < 915 => 4,
            < 920 => 5,
            < 925 => 6,
            < 930 => 7,
            < 935 => 8,
            < 940 => 9,
            < 960 => 10,
            < 975 => 11,
            < 990 => 12,
            < 1000 => 13,
        };
    }

    public static Item? GenerateSkillItem(Character character, SkillState state)
    {
        switch (state.Type)
        {
            case SkillType.Fishing:
                //todo use fish level/prof
                var hasMana = r.Next(100) >= 75;
                var hasLife = !hasMana || r.Next(100) >= 75;
                var tier = (int)Math.Floor(state.Level!.Value / 5d)+1;
                var item = new Item
                {
                    Id = NextId++,
                    Stats = new ItemStats
                    {
                        MaxLife = hasLife ? r.Next(100*tier) + 1 : 0,
                        MaxMana = hasMana ? r.Next(100*tier) + 1 : 0,
                    },
                    SubType = ItemSubType.Fish,
                    Quantity = 1,
                    Tier = tier,
                    OwnerId = character.Id
                };
                return item;
                break;
        }

        return null;
    }
}