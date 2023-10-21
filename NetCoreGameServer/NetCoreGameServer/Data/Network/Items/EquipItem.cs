using System.Diagnostics;
using MediatR;
using NetCoreGameServer.Background;
using NetCoreGameServer.Data.GameData;
using NetCoreGameServer.Data.Model;
using NetCoreGameServer.Data.Network.Characters;
using NetCoreGameServer.Service;
using NetCoreGameServer.Websocket;

namespace NetCoreGameServer.Data.Network.Items;

public class EquipItemRequestData
{
    public int ItemId { get; set; }
    public EquippedItemSlot EquippedItemSlot { get; set; }
}

public class EquipItemRequest : BaseRequestPacket<EquipItemRequestData>, IRequest
{
    public override int Type => (int)RequestPacketType.EquipItem;
}

public class EquipItemHandler : IRequestHandler<EquipItemRequest>
{
    private readonly GameSession _session;
    private readonly GameManager _gameManager;
    private readonly DatabaseThread _dbThread;

    public EquipItemHandler(GameSession session, GameManager gameManager, DatabaseThread dbThread)
    {
        _session = session;
        _gameManager = gameManager;
        _dbThread = dbThread;
    }

    public async Task Handle(EquipItemRequest request, CancellationToken cancellationToken)
    {
        var toEquip = _session.User.SelectedCharacter.AllItems.FirstOrDefault(x => x.Id == request.Data.ItemId);
        var currentlyEquipped = _session.User.SelectedCharacter.AllItems.FirstOrDefault(x => x.EquippedItemSlot == request.Data.EquippedItemSlot);
        if (CanEquipItem(_session.User.SelectedCharacter, toEquip, request.Data.EquippedItemSlot))
        {
            if (currentlyEquipped != null)
            {
                currentlyEquipped.EquippedItemSlot = null;
                _session.User.SelectedCharacter.Stats -= currentlyEquipped.Stats;
                await _dbThread.UpdateItem(currentlyEquipped);
            }

            toEquip.EquippedItemSlot = request.Data.EquippedItemSlot;
            _session.User.SelectedCharacter.Stats += toEquip.Stats;

            await _dbThread.UpdateItem(toEquip);
            _gameManager.GroupBroadcast(_session, new UpdateCharacterResponse
            {
                Data = _session.User.SelectedCharacter
            });
        }
    }

    private bool CanEquipItem(Character? character, Item? item, EquippedItemSlot slot)
    {
        if (character == null || item == null)
        {
            return false;
        }

        var maxTier = Math.Floor(3 + character.Level / 5d);
        var subTypes = slot switch
        {
            EquippedItemSlot.Weapon => WearableItems.ClassWeapons[(CharacterClasses)character.ClassId],
            EquippedItemSlot.Armor => WearableItems.ClassArmors[(CharacterClasses)character.ClassId],
            EquippedItemSlot.Charm => WearableItems.ClassCharms[(CharacterClasses)character.ClassId],
            EquippedItemSlot.AccCharm => WearableItems.ClassCharms[(CharacterClasses)character.ClassId],
            _ => throw new ArgumentOutOfRangeException(nameof(slot), slot, null)
        };

        var canEquipSubType = subTypes.Contains(item.SubType);
        var canEquipTier = maxTier >= item.Tier;

        return canEquipSubType && canEquipTier;
    }
}