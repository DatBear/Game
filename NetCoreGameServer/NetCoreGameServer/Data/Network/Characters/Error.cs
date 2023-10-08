using NetCoreGameServer.Data.Model;

namespace NetCoreGameServer.Data.Network.Characters;

public class ErrorResponse : BaseResponsePacket<ErrorMessage>
{
    public override int Type => (int)ResponsePacketType.Error;
}