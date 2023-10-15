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

    public bool IsObject()
    {
        return SubType >= ItemSubType.Fish;
    }
}