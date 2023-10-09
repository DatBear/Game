using MediatR;
using NetCoreGameServer.Data.Model;
using NetCoreGameServer.Websocket;

namespace NetCoreGameServer.Data.Network.Groups;

public class JoinGroupRequest : BaseRequestPacket<int>, IRequest
{
    public override int Type => (int)RequestPacketType.JoinGroup;
}

public class JoinGroupResponse : BaseResponsePacket<GroupUser>
{
    public override int Type => (int)ResponsePacketType.JoinGroup;
}

public class JoinGroupHandler : IRequestHandler<JoinGroupRequest>
{
    private readonly GameSession _session;
    private readonly GameManager _gameManager;

    public JoinGroupHandler(GameSession session, GameManager gameManager)
    {
        _session = session;
        _gameManager = gameManager;
    }

    public async Task Handle(JoinGroupRequest request, CancellationToken cancellationToken)
    {
        if (_session.User.Group != null)
        {
            _gameManager.RemoveUserFromGroup(_session.User.Group, _session.User);
        }

        var group = _gameManager.FindGroup(request.Data);
        _gameManager.AddUserToGroup(group, _session.User);
    }
}