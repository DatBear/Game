using MediatR;
using NetCoreGameServer.Background;
using NetCoreGameServer.Data.Model;
using NetCoreGameServer.Websocket;

namespace NetCoreGameServer.Data.Network.Items;

public class UpdateMarketItemRequest : BaseRequestPacket<MarketItem>, IRequest
{
    public override int Type => (int)RequestPacketType.UpdateMarketItem;
}

public class UpdateMarketItemResponse : BaseResponsePacket<MarketItem>
{
    public override int Type => (int)ResponsePacketType.UpdateMarketItem;
}

public class UpdateMarketItemHandler : IRequestHandler<UpdateMarketItemRequest>
{
    private GameSession _session;
    private DatabaseThread _dbThread;

    public UpdateMarketItemHandler(GameSession session, DatabaseThread dbThread)
    {
        _session = session;
        _dbThread = dbThread;
    }

    public async Task Handle(UpdateMarketItemRequest request, CancellationToken cancellationToken)
    {
        var marketItem = _session.User.MarketItems.FirstOrDefault(x => x.ItemId == request.Data.Item?.Id);
        if (marketItem == null) return;
        var oldPrice = marketItem.Price;
        marketItem.Price = request.Data.Price;
        if (await _dbThread.UpdateMarketItemPrice(marketItem))
        {
            _session.Send(new UpdateMarketItemResponse
            {
                Data = marketItem
            });
        }
        else
        {
            marketItem.Price = oldPrice;
        }
    }
}