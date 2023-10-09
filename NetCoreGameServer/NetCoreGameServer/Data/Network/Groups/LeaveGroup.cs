using MediatR;
using NetCoreGameServer.Data.Model;
using NetCoreGameServer.Websocket;

namespace NetCoreGameServer.Data.Network.Groups;

public class LeaveGroupRequest : BaseRequestPacket<int>, IRequest
{
    public override int Type => (int)RequestPacketType.LeaveGroup;
}

public class LeaveGroupResponse : BaseResponsePacket<User>
{
    public override int Type => (int)ResponsePacketType.LeaveGroup;
}

public class LeaveGroupHandler : IRequestHandler<LeaveGroupRequest>
{
    private readonly GameSession _session;
    private readonly GameManager _gameManager;

    public LeaveGroupHandler(GameSession session, GameManager gameManager)
    {
        _session = session;
        _gameManager = gameManager;
    }

    public async Task Handle(LeaveGroupRequest request, CancellationToken cancellationToken)
    {
        _gameManager.RemoveUserFromGroup(_session.User.Group, _session.User);
    }
}