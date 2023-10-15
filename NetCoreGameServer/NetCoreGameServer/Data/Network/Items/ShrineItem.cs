using MediatR;
using NetCoreGameServer.Data.Network.Characters;
using NetCoreGameServer.Service;
using NetCoreGameServer.Websocket;

namespace NetCoreGameServer.Data.Network.Items;

public class ShrineItemRequest : BaseRequestPacket<int>, IRequest
{
    public override int Type => (int)RequestPacketType.ShrineItem;
}

public class ShrineItemHandler : IRequestHandler<ShrineItemRequest>
{
    private readonly GameSession _session;
    private readonly ItemRepository _itemRepository;

    public ShrineItemHandler(GameSession session, ItemRepository itemRepository)
    {
        _session = session;
        _itemRepository = itemRepository;
    }

    public async Task Handle(ShrineItemRequest request, CancellationToken cancellationToken)
    {
        var character = _session.User.SelectedCharacter;
        if (character == null) return;
        var item = character.AllItems.FirstOrDefault(x => x.Id == request.Data);
        if (item == null) return;
        var numStats = item.Stats.NumStats();
        var maxHeal = item.Tier * numStats * 20;
        character.Life += Math.Min(maxHeal, character.Stats.MaxLife - character.Life);
        character.Mana += Math.Min(maxHeal, character.Stats.MaxMana - character.Mana);

        character.AllItems.Remove(item);
        await _itemRepository.DeleteItem(item);

        _session.Send(new UpdateCharacterResponse
        {
            Data = character
        });
    }
}