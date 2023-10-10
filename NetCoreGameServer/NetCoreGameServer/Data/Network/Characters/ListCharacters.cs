using MediatR;
using NetCoreGameServer.Data.Model;
using NetCoreGameServer.Service;
using NetCoreGameServer.Websocket;

namespace NetCoreGameServer.Data.Network.Characters;
public class ListCharactersRequest : BaseRequestPacket<NullData>, IRequest
{
    public override int Type => (int)RequestPacketType.ListCharacters;
}

public class ListCharactersResponse : BaseResponsePacket<Character[]>
{
    public override int Type => (int)ResponsePacketType.ListCharacters;
}

public class ListCharactersHandler : IRequestHandler<ListCharactersRequest>
{
    private readonly GameSession _session;

    public ListCharactersHandler(GameSession session)
    {
        _session = session;
    }

    public async Task Handle(ListCharactersRequest request, CancellationToken cancellationToken)
    {
        _session.Send(new ListCharactersResponse
        {
            Data = _session.User!.Characters.ToArray()
        });
    }
}