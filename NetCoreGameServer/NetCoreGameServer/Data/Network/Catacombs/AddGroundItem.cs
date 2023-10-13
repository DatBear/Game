using NetCoreGameServer.Data.Model;

namespace NetCoreGameServer.Data.Network.Catacombs;

public class AddGroundItemResponse : BaseResponsePacket<GroundItem>
{
    public override int Type => (int)ResponsePacketType.AddGroundItem;
}