using K4os.Hash.xxHash;
using NetCoreGameServer.Data.GameData;

namespace NetCoreGameServer.Data.Model;

public class Item
{
    public int Id { get; set; }
    public int Tier { get; set; }
    public int? Quantity { get; set; }
    public ItemSubType SubType { get; set; }
    public int? Position { get; set; }
    public EquippedItemSlot? EquippedItemSlot { get; set; }
    public int? OwnerId { get; set; }

    public int ItemStatsId { get; set; }
    public ItemStats Stats { get; set; } = new();
    public long? ExpiresAt { get; set; }

    public bool IsObject()
    {
        return SubType >= ItemSubType.Fish;
    }

    public bool CanStackWith(Item item)
    {
        //todo add max quantity check
        return Tier == item.Tier &&
               Quantity.HasValue && item.Quantity.HasValue &&
               SubType == item.SubType &&
               (Stats.ExperienceGained != 0) == (item.Stats.ExperienceGained != 0) &&
               (Stats.EnhancedEffect != 0) == (item.Stats.EnhancedEffect != 0) &&
               (SubType != ItemSubType.Essence || Stats.NumStats() == item.Stats.NumStats()) &&
               Id != item.Id;
    }

    //returns whether or not item should be entirely removed (0 quantity)
    public bool Unstack(int quantity = 1)
    {
        if (Quantity is null or <= 1) return true;
        Stats.EnhancedEffect -= (int)Math.Floor(Stats.EnhancedEffect / (decimal)Quantity.Value) * quantity;
        Stats.MaxLife -= (int)Math.Floor(Stats.MaxLife / (decimal)Quantity.Value) * quantity;
        Stats.MaxMana -= (int)Math.Floor(Stats.MaxMana / (decimal)Quantity.Value) * quantity;
        Stats.ExperienceGained -= (int)Math.Floor(Stats.ExperienceGained / (decimal)Quantity.Value) * quantity;
        Quantity -= quantity;
        return Quantity == 0;
    }


    public int[] GetRange(Character character)
    {
        //todo add defense calcs
        var data = ItemStatValues.ForDamageCalculation[SubType];
        switch (WearableItems.GetItemType(SubType))
        {
            case ItemType.Weapon:
            {
                var statDamage = Math.Floor(character.Stats.Strength * data[4] / 100d) + Math.Floor(character.Stats.Dexterity * (100 - data[4]) / 100d);
                statDamage = Math.Floor(statDamage * 1.25);
                return new[] { GetCalcStat(data[1], Tier, statDamage, Stats.EnhancedEffect), GetCalcStat(data[2], Tier, statDamage, Stats.EnhancedEffect) };
            }
            case ItemType.Charm:
            {
                var ee = Stats.EnhancedEffect + Stats.Intelligence;
                return new[] { GetCalcStat(data[1], Tier, Stats.Intelligence, ee), GetCalcStat(data[2], Tier, Stats.Intelligence, ee) };
            }
        }
        
        return new[] { 0, 0 };
    }

    private int GetCalcStat(int perTier, int itemTier, double statDamage, int ee)
    {
        return (int)Math.Floor((perTier * itemTier) * (100 + statDamage - 5) / 100d * ((100 + ee) / 100d));
    }
}