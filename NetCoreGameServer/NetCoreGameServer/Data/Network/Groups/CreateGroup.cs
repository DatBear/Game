using MediatR;
using NetCoreGameServer.Data.Model;
using NetCoreGameServer.Service;
using NetCoreGameServer.Websocket;

namespace NetCoreGameServer.Data.Network.Groups;

public class CreateGroupRequest : BaseRequestPacket<GroupOptions>, IRequest
{
    public override int Type => (int)RequestPacketType.CreateGroup;
}

public class CreateGroupResponse : BaseResponsePacket<Group>
{
    public override int Type => (int)ResponsePacketType.CreateGroup;
}

public class CreateGroupHandler : IRequestHandler<CreateGroupRequest>
{
    private readonly GameSession _session;
    private readonly GameManager _gameManager;

    public CreateGroupHandler(GameSession session, GameManager gameManager)
    {
        _session = session;
        _gameManager = gameManager;
    }
    
    public async Task Handle(CreateGroupRequest request, CancellationToken cancellationToken)
    {
        if (_session.User.Group != null)
        {
            _session.SendError("You must leave your group before trying to create a new group.");
            return;
        }

        var group = _gameManager.CreateGroup(new Group
        {
            LeaderId = _session.User!.Id,
            Options = request.Data,
            Users = new List<GroupUser>
            {
                _session.User.AsGroupUser()
            },
            Maze = MazeGenerator.Generate(10)//todo base on char level
        });
        
        _session.User.Group = group;

        _session.Send(new CreateGroupResponse
        {
            Data = group
        });
    }
}