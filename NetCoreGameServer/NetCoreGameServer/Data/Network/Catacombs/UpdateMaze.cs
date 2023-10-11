using MediatR;
using NetCoreGameServer.Data.Model;

namespace NetCoreGameServer.Data.Network.Catacombs;

public class UpdateMazeRequest : BaseRequestPacket<NullData>, IRequest
{
    public override int Type => (int)RequestPacketType.UpdateMaze;
}

public class UpdateMazeResponse : BaseResponsePacket<Maze>
{
    public override int Type => (int)ResponsePacketType.UpdateMaze;
}