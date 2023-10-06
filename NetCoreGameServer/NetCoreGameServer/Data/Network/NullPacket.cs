using Newtonsoft.Json;

namespace NetCoreGameServer.Data.Network;

public class NullPacket : BasePacket<NullData>
{
    [JsonIgnore]
    public override int Type { get; }

    [JsonProperty("Type")]
    public int PacketType { get; set; }
}