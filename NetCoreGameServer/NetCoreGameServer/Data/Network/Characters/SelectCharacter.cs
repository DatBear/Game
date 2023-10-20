using MediatR;
using NetCoreGameServer.Background;
using NetCoreGameServer.Data.Model;
using NetCoreGameServer.Service;
using NetCoreGameServer.Websocket;

namespace NetCoreGameServer.Data.Network.Characters;

public class SelectCharacterRequest: BaseRequestPacket<int?>, IRequest
{
    public override int Type => (int)RequestPacketType.SelectCharacter;
}

public class SelectCharacterResponse : BaseResponsePacket<int?>
{
    public override int Type => (int)ResponsePacketType.SelectCharacter;
}

public class SelectCharacterHandler : IRequestHandler<SelectCharacterRequest>
{
    private readonly GameSession _session;
    private readonly DatabaseThread _dbThread;

    public SelectCharacterHandler(GameSession session, DatabaseThread dbThread)
    {
        _session = session;
        _dbThread = dbThread;
    }

    public async Task Handle(SelectCharacterRequest request, CancellationToken cancellationToken)
    {
        if (_session.User.SelectedCharacter != null)
        {
            await _dbThread.UpdateCharacter(_session.User.SelectedCharacter);
        }
        _session.User!.SelectedCharacter = _session.User.Characters.FirstOrDefault(x => x.Id == request.Data);

        if (_session.User.SelectedCharacter != null)
        {
            _session.User.SelectedCharacter.Zone = Zone.Town;
        }

        _session.Send(new SelectCharacterResponse
        {
            Data = _session.User.SelectedCharacter != null ? request.Data : null
        });
    }
}