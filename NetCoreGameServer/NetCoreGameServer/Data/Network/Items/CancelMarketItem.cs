using MediatR;
using NetCoreGameServer.Background;
using NetCoreGameServer.Data.Model;
using NetCoreGameServer.Websocket;

namespace NetCoreGameServer.Data.Network.Items;

public class CancelMarketItemRequest : BaseRequestPacket<int>, IRequest
{
    public override int Type => (int)RequestPacketType.CancelMarketItem;
}

public class CancelMarketItemResponse : BaseResponsePacket<MarketItem>
{
    public override int Type => (int)ResponsePacketType.CancelMarketItem;
}

public class CancelMarketItemHandler : IRequestHandler<CancelMarketItemRequest>
{
    private readonly GameSession _session;
    private readonly DatabaseThread _dbThread;

    public CancelMarketItemHandler(GameSession session, DatabaseThread dbThread)
    {
        _session = session;
        _dbThread = dbThread;
    }

    public async Task Handle(CancelMarketItemRequest request, CancellationToken cancellationToken)
    {
        var character = _session.User.SelectedCharacter;
        if (character == null) return;

        var item = _session.User.MarketItems.FirstOrDefault(x => x.Item.Id == request.Data);
        if (item == null) return;
        if (item.Item.SubType >= ItemSubType.Fish && character.Items.Count > Character.ItemSlots - 1) return;
        if (item.Item.SubType < ItemSubType.Fish && character.Equipment.Count > character.EquipmentSlots - 1) return;

        item.Item.OwnerId = character.Id;
        if (await _dbThread.CancelMarketItem(item, character))
        {
            _session.Send(new CancelMarketItemResponse
            {
                Data = item
            });
        }
        else
        {
            item.Item.OwnerId = null;
        }
    }
}