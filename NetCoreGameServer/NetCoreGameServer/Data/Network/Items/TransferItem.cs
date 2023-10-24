using MediatR;
using NetCoreGameServer.Background;
using NetCoreGameServer.Data.Model;
using NetCoreGameServer.Websocket;

namespace NetCoreGameServer.Data.Network.Items;

public class TransferItemData
{
    public int ItemId { get; set; }
    public int CharacterId { get; set; }
}

public class TransferItemRequest : BaseRequestPacket<TransferItemData>, IRequest
{
    public override int Type => (int)RequestPacketType.TransferItem;
}

public class TransferItemResponse : BaseResponsePacket<TransferItemData>
{
    public override int Type => (int)ResponsePacketType.TransferItem;
}

public class TransferItemHandler : IRequestHandler<TransferItemRequest>
{
    private readonly GameSession _session;
    private readonly DatabaseThread _dbThread;

    public TransferItemHandler(GameSession session, DatabaseThread dbThread)
    {
        _session = session;
        _dbThread = dbThread;
    }

    public async Task Handle(TransferItemRequest request, CancellationToken cancellationToken)
    {
        var fromCharacter = _session.User.SelectedCharacter;
        var toCharacter = _session.User.Characters.FirstOrDefault(x => x.Id == request.Data.CharacterId);
        if (fromCharacter == null || toCharacter == null || fromCharacter.Id == toCharacter.Id) return;
        var item = fromCharacter.AllItems.FirstOrDefault(x => x.Id == request.Data.ItemId);
        if(item == null) return;
        if (item.SubType >= ItemSubType.Fish && toCharacter.Items.Count > Character.ItemSlots - 1) return;
        if (item.SubType < ItemSubType.Fish && toCharacter.Equipment.Count > toCharacter.EquipmentSlots - 1) return;

        item.OwnerId = toCharacter.Id;
        if (await _dbThread.UpdateItem(item))
        {
            fromCharacter.AllItems.Remove(item);
            toCharacter.AllItems.Add(item);
            _session.Send(new TransferItemResponse
            {
                Data = request.Data
            });
        }
        else
        {
            item.OwnerId = fromCharacter.Id;
        }
    }
}