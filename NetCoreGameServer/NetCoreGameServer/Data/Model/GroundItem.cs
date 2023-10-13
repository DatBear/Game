using Newtonsoft.Json;

namespace NetCoreGameServer.Data.Model;

public class GroundItem
{
    public Item Item { get; set; }
    public long ExpiresTimestamp { get; set; }
    public bool HasGroupClicked { get; set; }
    public bool HasUserClicked { get; set; }

    [JsonIgnore]
    public readonly List<User> PickAttempted = new();
}