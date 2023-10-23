using MediatR;
using NetCoreGameServer.Background;
using NetCoreGameServer.Data.Model;
using NetCoreGameServer.Data.Network.Characters;
using NetCoreGameServer.Websocket;

namespace NetCoreGameServer.Data.Network.Items;

public class SellItemRequestData
{
    public int ItemId { get; set; }
    public decimal Price { get; set; }
}

public class SellItemResponseData
{
    public MarketItem Item { get; set; }
}

public class SellItemRequest : BaseRequestPacket<SellItemRequestData>, IRequest
{
    public override int Type => (int)RequestPacketType.SellItem;
}

public class SellItemResponse : BaseResponsePacket<SellItemResponseData>
{
    public override int Type => (int)ResponsePacketType.SellItem;
}

public class SellItemHandler : IRequestHandler<SellItemRequest>
{
    private readonly GameSession _session;
    private readonly DatabaseThread _dbThread;

    public SellItemHandler(GameSession session, DatabaseThread dbThread)
    {
        _session = session;
        _dbThread = dbThread;
    }

    public async Task Handle(SellItemRequest request, CancellationToken cancellationToken)
    {
        //todo subtract fee, check gold password when there is a fee
        var character = _session.User.SelectedCharacter;
        if (character == null) return;
        var item = _session.User.SelectedCharacter?.AllItems.FirstOrDefault(x => !x.ExpiresAt.HasValue && x.Id == request.Data.ItemId);
        if (item == null) return;
        var marketItem = new MarketItem
        {
            Item = item,
            ItemId = item.Id,
            Price = request.Data.Price,
            UserId = _session.User.Id,
            ExpiresAt = DateTimeOffset.UtcNow.AddDays(3).ToUnixTimeMilliseconds()
        };

        item.OwnerId = null;
        var previousItemSlot = item.EquippedItemSlot;
        item.EquippedItemSlot = null;
        if (await _dbThread.SellItem(marketItem))
        {
            character.AllItems.Remove(item);
            _session.User.MarketItems.Add(marketItem);

            _session.Send(new SellItemResponse
            {
                Data = new SellItemResponseData
                {
                    Item = marketItem
                }
            });
        }
        else
        {
            item.OwnerId = character.Id;
            item.EquippedItemSlot = previousItemSlot;
        }
    }
}