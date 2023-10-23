using MediatR;
using NetCoreGameServer.Background;
using NetCoreGameServer.Data.GameData;
using NetCoreGameServer.Data.Model;
using NetCoreGameServer.Websocket;

namespace NetCoreGameServer.Data.Network.Items;


public class SearchMarketItemsRequestData
{
    public ItemType Type { get; set; }
    public ItemSubType? SubType { get; set; }
    public int[] TierRange { get; set; }
    public int[] MagicLevel { get; set; }
    public int[] CostRange { get; set; }
    public ItemStats[] Attributes { get; set; }
    public bool UsableOnly { get; set; }
}

public class SearchMarketItemsDbRequest
{
    public ItemSubType? SubType { get; set; }
    public int? MinTier { get; set; }
    public int? MaxTier { get; set; }
    public int? MinCost { get; set; }
    public int? MaxCost { get; set; }

    public SearchMarketItemsDbRequest(SearchMarketItemsRequestData data)
    {
        SubType = data.SubType;
        MinTier = data.TierRange[0] > 0 ? data.TierRange[0] : null;
        MaxTier = data.TierRange[1] > 0 ? data.TierRange[1] : null;
        MinCost= data.CostRange[0] > 0 ? data.CostRange[0] : null;
        MaxCost = data.CostRange[1] > 0 ? data.CostRange[1] : null;
    }
}

public class SearchMarketItemsRequest : BaseRequestPacket<SearchMarketItemsRequestData>, IRequest
{
    public override int Type => (int)RequestPacketType.SearchMarketItems;
}

public class SearchMarketItemsResponse : BaseResponsePacket<List<MarketItem>>
{
    public override int Type => (int)ResponsePacketType.SearchMarketItems;
}

public class SearchMarketItemsHandler : IRequestHandler<SearchMarketItemsRequest>
{
    private readonly GameSession _session;
    private readonly DatabaseThread _dbThread;

    public SearchMarketItemsHandler(GameSession session, DatabaseThread dbThread)
    {
        _session = session;
        _dbThread = dbThread;
    }

    public async Task Handle(SearchMarketItemsRequest request, CancellationToken cancellationToken)
    {
        var items = await _dbThread.SearchMarketItems(new SearchMarketItemsDbRequest(request.Data));
        items = items.Where(x => WearableItems.GetItemType(x.Item.SubType) == request.Data.Type)
                     .Where(x => x.Item.Stats.NumStats() >= request.Data.MagicLevel[0] && (request.Data.MagicLevel[1] == -1 || x.Item.Stats.NumStats() <= request.Data.MagicLevel[1]))
                     .ToList();
        _session.Send(new SearchMarketItemsResponse
        {
            Data = items
        });
    }
}