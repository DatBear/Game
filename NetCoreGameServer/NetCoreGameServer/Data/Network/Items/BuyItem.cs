using MediatR;
using NetCoreGameServer.Background;
using NetCoreGameServer.Data.Model;
using NetCoreGameServer.Data.Network.Characters;
using NetCoreGameServer.Websocket;

namespace NetCoreGameServer.Data.Network.Items;

public class BuyItemRequestData
{
    public int ItemId { get; set; }
    public decimal Price { get; set; }
}

public class BuyItemRequest : BaseRequestPacket<BuyItemRequestData>, IRequest
{
    public override int Type => (int)RequestPacketType.BuyItem;
}

public class BuyItemResponse : BaseResponsePacket<MarketItem>
{
    public override int Type => (int)ResponsePacketType.BuyItem;
}

public class BuyItemHandler : IRequestHandler<BuyItemRequest>
{
    private readonly GameSession _session;
    private readonly DatabaseThread _dbThread;
    private readonly GameManager _gameManager;

    public BuyItemHandler(GameSession session, DatabaseThread dbThread, GameManager gameManager)
    {
        _session = session;
        _dbThread = dbThread;
        _gameManager = gameManager;
    }

    public async Task Handle(BuyItemRequest request, CancellationToken cancellationToken)
    {
        var character = _session.User.SelectedCharacter;
        if (character == null) return;
        var item = await _dbThread.GetMarketItem(request.Data.ItemId);
        if (item == null || item.Price != request.Data.Price) return;
        if (item.UserId == _session.User.Id) return;
        if (item.Price > _session.User.Gold) return;
        if (item.Item.SubType >= ItemSubType.Fish && character.Items.Count > Character.ItemSlots-1) return;
        if (item.Item.SubType < ItemSubType.Fish && character.Equipment.Count > character.EquipmentSlots - 1) return;

        item.Item.OwnerId = character.Id;
        if (await _dbThread.BuyItem(item, _session.User))
        {
            character.AllItems.Add(item.Item);

            _session.Send(new BuyItemResponse
            {
                Data = item
            });

            //update seller
            var sellerSession = _gameManager.GetSession(item.UserId);
            if (sellerSession != null)
            {
                item.IsSold = true;
                sellerSession.User.Gold += item.Price;
                sellerSession.Send(new UpdateMarketItemResponse
                {
                    Data = item
                });
            }
        }
        else
        {
            item.Item.OwnerId = null;
        }
    }
}