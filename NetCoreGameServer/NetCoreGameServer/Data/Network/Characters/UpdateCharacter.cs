using MediatR;
using NetCoreGameServer.Data.Model;
using NetCoreGameServer.Websocket;

namespace NetCoreGameServer.Data.Network.Characters;

public class UpdateCharacterRequest : BaseRequestPacket<int>, IRequest
{
    public override int Type => (int)RequestPacketType.UpdateCharacter;
}

public class UpdateCharacterResponse : BaseResponsePacket<Character>
{
    public override int Type => (int)ResponsePacketType.UpdateCharacter;
}

public class UpdateCharacterHandler : IRequestHandler<UpdateCharacterRequest>
{
    private readonly GameSession _session;
    private readonly GameManager _gameManager;

    public UpdateCharacterHandler(GameSession session, GameManager gameManager)
    {
        _session = session;
        _gameManager = gameManager;
    }

    public async Task Handle(UpdateCharacterRequest request, CancellationToken cancellationToken)
    {
        var character = _gameManager.FindCharacter(request.Data);
        if (character != null)
        {
            _session.Send(new UpdateCharacterResponse
            {
                Data = character
            });
        }
    }
}