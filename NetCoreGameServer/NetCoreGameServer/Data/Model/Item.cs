namespace NetCoreGameServer.Data.Model;

public class Item
{
    public int Id { get; set; }
    public int Tier { get; set; }
    public int? Quantity { get; set; }
    public ItemSubType SubType { get; set; }
}