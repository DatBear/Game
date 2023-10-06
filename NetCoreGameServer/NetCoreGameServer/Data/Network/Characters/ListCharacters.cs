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
    private readonly UserRepository _userRepository;
    private readonly User _user;

    public ListCharactersHandler(GameSession session, UserRepository userRepository, User user)
    {
        _session = session;
        _userRepository = userRepository;
        _user = user;
    }

    public async Task Handle(ListCharactersRequest request, CancellationToken cancellationToken)
    {
        var user = _userRepository.GetUserDetails(_user.Id)!;
        _session.Send(new ListCharactersResponse
        {
            Data = user.Characters.ToArray()
        });
    }
}