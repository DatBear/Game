using MediatR;
using NetCoreGameServer.Background;
using NetCoreGameServer.Data.Network.Characters;
using NetCoreGameServer.Service;
using NetCoreGameServer.Websocket;

namespace NetCoreGameServer.Data.Network.Items;

public class DeleteItemRequest : BaseRequestPacket<int>, IRequest
{
    public override int Type => (int)RequestPacketType.DeleteItem;
}

public class DeleteItemHandler : IRequestHandler<DeleteItemRequest>
{
    private readonly GameSession _session;
    private readonly DatabaseThread _dbThread;

    public DeleteItemHandler(GameSession session, DatabaseThread dbThread)
    {
        _session = session;
        _dbThread = dbThread;
    }

    public async Task Handle(DeleteItemRequest request, CancellationToken cancellationToken)
    {
        var itemToDelete = _session.User.SelectedCharacter.AllItems.FirstOrDefault(x => x.Id == request.Data);
        if (itemToDelete != null)
        {
            await _dbThread.DeleteItem(itemToDelete);
            _session.User.SelectedCharacter.AllItems.Remove(itemToDelete);
            _session.Send(new UpdateCharacterResponse()
            {
                Data = _session.User.SelectedCharacter
            });
        }
    }
}
