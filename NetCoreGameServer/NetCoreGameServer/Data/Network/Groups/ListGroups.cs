using MediatR;
using NetCoreGameServer.Data.Model;
using NetCoreGameServer.Websocket;

namespace NetCoreGameServer.Data.Network.Groups;

public class ListGroupsRequest : BaseRequestPacket<NullData>, IRequest
{
    public override int Type => (int)RequestPacketType.ListGroups;
}

public class ListGroupsResponse : BaseResponsePacket<Group[]>
{
    public override int Type => (int)ResponsePacketType.ListGroups;
}

public class ListGroupHandler : IRequestHandler<ListGroupsRequest>
{
    private readonly GameSession _session;
    private readonly GameManager _gameManager;
    
    public ListGroupHandler(GameSession session, GameManager gameManager)
    {
        _session = session;
        _gameManager = gameManager;
    }

    public async Task Handle(ListGroupsRequest request, CancellationToken cancellationToken)
    {
        var groups = _gameManager.GetGroups();
        _session.Send(new ListGroupsResponse
        {
            Data = groups.ToArray()
        });
    }
}