using MediatR;
using NetCoreGameServer.Data.Model;
using NetCoreGameServer.Service;
using NetCoreGameServer.Websocket;

namespace NetCoreGameServer.Data.Network.Users;

public class GetUserRequest : BaseRequestPacket<NullData>, IRequest
{
    public override int Type => (int)RequestPacketType.GetUser;
}

public class GetUserResponse : BaseResponsePacket<User>
{
    public override int Type => (int)ResponsePacketType.GetUser;
}

public class GetUserHandler : IRequestHandler<GetUserRequest>
{
    private readonly GameSession _session;

    public GetUserHandler(GameSession session)
    {
        _session = session;
    }

    public async Task Handle(GetUserRequest request, CancellationToken cancellationToken)
    {
        _session.User.Maze ??= MazeGenerator.Generate(10);//todo base on level
        _session.Send(new GetUserResponse
        {
            Data = _session.User!
        });
    }
}