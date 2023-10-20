using K4os.Hash.xxHash;

namespace NetCoreGameServer.Data.Model;

public class Item
{
    public int Id { get; set; }
    public int Tier { get; set; }
    public int? Quantity { get; set; }
    public ItemSubType SubType { get; set; }
    public int? Position { get; set; }
    public EquippedItemSlot? EquippedItemSlot { get; set; }
    public int OwnerId { get; set; }

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
}