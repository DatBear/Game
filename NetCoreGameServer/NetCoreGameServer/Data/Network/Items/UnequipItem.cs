using MediatR;
using NetCoreGameServer.Data.Model;
using NetCoreGameServer.Data.Network.Characters;
using NetCoreGameServer.Websocket;

namespace NetCoreGameServer.Data.Network.Items;

public class UnequipItemRequest : BaseRequestPacket<EquippedItemSlot>, IRequest
{
    public override int Type => (int)RequestPacketType.UnequipItem;
}

public class UnequipItemHandler : IRequestHandler<UnequipItemRequest> {

    private readonly GameSession _session;
    private readonly GameManager _gameManager;

    public UnequipItemHandler(GameSession session, GameManager gameManager)
    {
        _session = session;
        _gameManager = gameManager;
    }

    public async Task Handle(UnequipItemRequest request, CancellationToken cancellationToken)
    {
        var toUnequip = _session.User.SelectedCharacter.AllItems.FirstOrDefault(x => x.EquippedItemSlot == request.Data);
        if (toUnequip != null && CanUnequipItem(_session.User.SelectedCharacter, toUnequip))
        {
            toUnequip.EquippedItemSlot = null;
            _session.User.SelectedCharacter.Stats -= toUnequip.Stats;

            _session.Send(new UpdateCharacterResponse
            {
                Data = _session.User.SelectedCharacter
            });
        }
    }

    private bool CanUnequipItem(Character character, Item item)
    {
        return character.Equipment.Count < character.EquipmentSlots;
    }
}