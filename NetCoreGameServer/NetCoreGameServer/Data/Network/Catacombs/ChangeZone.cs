using MediatR;
using NetCoreGameServer.Data.Model;
using NetCoreGameServer.Data.Network.Characters;
using NetCoreGameServer.Websocket;

namespace NetCoreGameServer.Data.Network.Catacombs;

public class ChangeZoneRequest : BaseRequestPacket<Zone>, IRequest
{
    public override int Type => (int)RequestPacketType.ChangeZone;
}

public class ChangeZoneHandler : IRequestHandler<ChangeZoneRequest>
{
    private readonly GameSession _session;
    private readonly GameManager _gameManager;

    public ChangeZoneHandler(GameSession session, GameManager gameManager)
    {
        _session = session;
        _gameManager = gameManager;
    }

    public async Task Handle(ChangeZoneRequest request, CancellationToken cancellationToken)
    {
        if (_session.User.SelectedCharacter == null) return;

        _session.User.SelectedCharacter.Zone = request.Data;
        _gameManager.GroupBroadcast(_session.User.Group, new UpdateCharacterResponse
        {
            Data = _session.User.SelectedCharacter
        }, _session.User);
    }
}
