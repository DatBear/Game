using Newtonsoft.Json;

namespace NetCoreGameServer.Data.Model;

public class MarketItem
{
    public int Id { get; set; }
    [JsonIgnore]
    public int ItemId { get; set; }
    public int UserId { get; set; }
    public decimal Price { get; set; }
    public long ExpiresAt { get; set; }
    public Item Item { get; set; }

    //not persisted
    public bool IsSold { get; set; }
}