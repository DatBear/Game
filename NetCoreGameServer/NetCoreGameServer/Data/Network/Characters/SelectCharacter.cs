using MediatR;
using NetCoreGameServer.Data.Model;
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
    private readonly User _user;
    private readonly GameSession _session;

    public SelectCharacterHandler(User user, GameSession session)
    {
        _user = user;
        _session = session;
    }

    public async Task Handle(SelectCharacterRequest request, CancellationToken cancellationToken)
    {
        _user.SelectedCharacter = _user.Characters.FirstOrDefault(x => x.Id == request.Data);

        if (_user.SelectedCharacter != null)
        {
            _user.SelectedCharacter.Zone = Zone.Town;
        }

        _session.Send(new SelectCharacterResponse
        {
            Data = _user.SelectedCharacter != null ? request.Data : null
        });
    }
}