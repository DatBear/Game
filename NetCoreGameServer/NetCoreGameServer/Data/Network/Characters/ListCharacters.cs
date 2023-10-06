using MediatR;
using NetCoreGameServer.Data.Model;
using NetCoreGameServer.Service;
using NetCoreGameServer.Websocket;

namespace NetCoreGameServer.Data.Network.Characters;
public class ListCharactersRequest : BaseRequestPacket<NullData>, IRequest<ListCharactersResponse>
{
    public override int Type => (int)RequestPacketType.ListCharacters;
}

public class ListCharactersResponse : BaseResponsePacket<Character[]>
{
    public override int Type => (int)ResponsePacketType.ListCharacters;
}

public class ListCharactersHandler : IRequestHandler<ListCharactersRequest, ListCharactersResponse>
{
    private readonly GameSession _session;
    private readonly UserService _userService;
    private readonly User _user;

    public ListCharactersHandler(GameSession session, UserService userService, User user)
    {
        _session = session;
        _userService = userService;
        _user = user;
    }

    public Task<ListCharactersResponse>? Handle(ListCharactersRequest request, CancellationToken cancellationToken)
    {
        var user = _userService.GetUserDetails(_user.Id)!;
        _session.Send(new ListCharactersResponse
        {
            Data = user.Characters.ToArray()
        });
        return null;
    }
}