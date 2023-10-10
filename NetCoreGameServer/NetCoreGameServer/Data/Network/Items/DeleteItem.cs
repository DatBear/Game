using MediatR;
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
    private readonly ItemRepository _itemRepository;

    public DeleteItemHandler(GameSession session, ItemRepository itemRepository)
    {
        _session = session;
        _itemRepository = itemRepository;
    }

    public async Task Handle(DeleteItemRequest request, CancellationToken cancellationToken)
    {
        var itemToDelete = _session.User.SelectedCharacter.AllItems.FirstOrDefault(x => x.Id == request.Data);
        if (itemToDelete != null)
        {
            await _itemRepository.DeleteItem(itemToDelete);
            _session.User.SelectedCharacter.AllItems.Remove(itemToDelete);
            _session.Send(new UpdateCharacterResponse()
            {
                Data = _session.User.SelectedCharacter
            });
        }
    }
}
