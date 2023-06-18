namespace NetCoreGameServer.Data.Model;

public class CharItem
{
    public int CharId { get; set; }
    public int ItemId { get; set; }
    public int? EquippedItemSlot { get; set; }
    public int? InventorySlot { get; set; }
    public int? EquipmentSlot { get; set; }
}