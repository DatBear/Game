using NetCoreGameServer.Data.Model;

namespace NetCoreGameServer.Data.Network.Catacombs;

public class UpdateGroundItemResponse : BaseResponsePacket<GroundItem>
{
    public override int Type => (int)ResponsePacketType.UpdateGroundItem;
}