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
        var tier = r.Next(maxTier) + 1;
        var randomSubType = (ItemSubType)r.Next((int)ItemSubType.Essence + 1); //todo change this, fish/glyphs/maps/etc. can't drop
        var possibleStats = PossibleStats(randomSubType);
        var numStats = RandomWeightedStatAmount();
        var itemStats = GenerateStats(possibleStats, numStats, tier);

        var item = new Item
        {
            Id = NextId++,
            Stats = itemStats,
            Tier = tier,
            SubType = randomSubType
        };
        return item;
    }

    private static ItemStats GenerateStats(List<ItemStat> possibleStats, int numStats, int tier)
    {
        numStats = Math.Min(numStats, possibleStats.Count);
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
                prop.SetValue(itemStats, val); //todo don't use reflection
            }
        }

        return itemStats;
    }

    private static List<ItemStat> PossibleStats(ItemSubType type)
    {
        return type switch
        {
            < ItemSubType.Fish => Enum.GetValues<ItemStat>().Take((int)ItemStat.Jubilance + 1).ToList(),
            ItemSubType.Fish => new List<ItemStat> { ItemStat.MaxLife, ItemStat.MaxMana },
            ItemSubType.FishingRod => new List<ItemStat> { ItemStat.EnhancedEffect },
            ItemSubType.Comfrey => new List<ItemStat> { ItemStat.MaxLife, ItemStat.MaxMana },
            ItemSubType.Potion => Enum.GetValues<ItemStat>().Take((int)ItemStat.Jubilance + 1).ToList(),
            ItemSubType.Totem => Enum.GetValues<ItemStat>().Take((int)ItemStat.Jubilance + 1).ToList(),
            ItemSubType.Essence => new List<ItemStat> { ItemStat.EnhancedEffect }, //only magical essences?
            ItemSubType.Map => Enum.GetValues<ItemStat>().ToList(),
            _ => Enum.GetValues<ItemStat>().ToList()
        };
    }

    private static int RandomWeightedStatAmount()
    {
        var rand = r.Next(1000);
        return rand switch
        {
            < 500 => 0, //< 500
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

    public static (Item? addItem, List<Item?>? removeItems) GenerateSkillItem(Character character, SkillState state)
    {
        //todo use fish level/prof/item tier/item stat #
        var firstItem = state.InputItems.Count > 0 ? state.InputItems.First() : null;
        var secondItem = state.InputItems.Count > 1 ? state.InputItems.Last() : null;
        switch (state.Type)
        {
            case SkillType.Fishing:
            {
                if (state.IsLost())
                {
                    return (null, new List<Item?> { state.InputItems.FirstOrDefault() });
                }

                if (!state.IsWon())
                {
                    return (null, null);
                }


                var hasMana = r.Next(100) >= 75;
                var hasLife = !hasMana || r.Next(100) >= 75;
                var tier = (int)Math.Floor(state.Level!.Value / 5d) + 1;
                var item = new Item
                {
                    Id = NextId++,
                    Stats = new ItemStats
                    {
                        MaxLife = hasLife ? r.Next(100 * tier) + 1 : 0,
                        MaxMana = hasMana ? r.Next(100 * tier) + 1 : 0,
                    },
                    SubType = ItemSubType.Fish,
                    Quantity = 1,
                    Tier = tier,
                    OwnerId = character.Id
                };
                return (item, null);
            }
            case SkillType.Cooking:
            {
                var fish = state.InputItems.First();
                var cooked = Math.Min(100, state.Progress[1]) + (state.IsLost() ? -100 : 0);
                var multiplier = 1 + cooked / 100d; //something like this...
                var item = new Item
                {
                    Id = NextId++,
                    Stats = new ItemStats
                    {
                        MaxLife = (int)Math.Floor(fish.Stats.MaxLife * multiplier),
                        MaxMana = (int)Math.Floor(fish.Stats.MaxMana * multiplier),
                        ExperienceGained = cooked,
                    },
                    Tier = fish.Tier,
                    OwnerId = character.Id,
                    Quantity = 1,
                    SubType = fish.SubType,
                };
                return (item, new List<Item?> { fish });
            }
            case SkillType.Glyphing:
            {
                if (firstItem != null && secondItem == null)
                {
                    //glyphing
                    if (!state.IsWon())
                    {
                        return (null, new List<Item?> { firstItem });
                    }

                    var item = new Item
                    {
                        Id = NextId++,
                        OwnerId = character.Id,
                        SubType = ItemSubType.Glyph,
                        Tier = firstItem.Tier,
                        Stats = firstItem.Stats
                    };

                    return (item, new List<Item?> { firstItem });
                }
                else
                {
                    //reglyphing
                }

                break;
            }
            case SkillType.Transmuting:
            {
                if (firstItem != null && secondItem == null)
                {
                    //creating essence
                    if (!state.IsWon())
                    {
                        return (null, new List<Item?> { firstItem });
                    }

                    var essence = new Item
                    {
                        Id = NextId++,
                        OwnerId = character.Id,
                        Quantity = 1,
                        SubType = ItemSubType.Essence,
                        Tier = firstItem.Tier,
                        Stats = new ItemStats(),
                    };
                    ItemStatValues.EssenceActions.Take(firstItem.Stats.NumStats()).ToList().ForEach(x => x(essence.Stats));
                    return (essence, new List<Item?> { firstItem });
                }

                //transmuting item
                if (!state.IsWon())
                {
                    return (null, state.InputItems); //ridiculous warning
                }

                var possibleStats = PossibleStats(firstItem.SubType);
                var stats = GenerateStats(possibleStats, secondItem.Stats.NumStats(), firstItem.Tier);
                var item = new Item
                {
                    Id = NextId++,
                    OwnerId = character.Id,
                    Tier = firstItem.Tier,
                    SubType = firstItem.SubType,
                    Stats = stats
                };

                return (item, state.InputItems);
            }
            case SkillType.Suffusencing:
            {
                if (!state.IsWon())
                {
                    return (null, state.InputItems);
                }


                var item = new Item
                {
                    Id = NextId++,
                    OwnerId = character.Id,
                    Quantity = firstItem.Quantity.HasValue ? 1 : 0,
                    SubType = firstItem.SubType,
                    Tier = firstItem.Tier,
                    Stats = firstItem.Stats,
                };
                item.Stats.EnhancedEffect = secondItem.Stats.NumStats() * 20;
                switch (firstItem.SubType)
                {
                    case ItemSubType.Fish:
                        item.Stats.MaxLife = (int)Math.Floor(item.Stats.MaxLife * ((100 + item.Stats.EnhancedEffect) / 100d));
                        item.Stats.MaxMana = (int)Math.Floor(item.Stats.MaxMana * ((100 + item.Stats.EnhancedEffect) / 100d));
                        break;
                }

                return (item, state.InputItems);
            }
        }

        return (null, null);
    }
}