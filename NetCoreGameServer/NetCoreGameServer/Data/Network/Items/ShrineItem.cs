using MediatR;
using NetCoreGameServer.Background;
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
    private readonly DatabaseThread _dbThread;
    private readonly GameManager _gameManager;

    public ShrineItemHandler(GameSession session, DatabaseThread dbThread, GameManager gameManager)
    {
        _session = session;
        _dbThread = dbThread;
        _gameManager = gameManager;
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
        await _dbThread.DeleteItem(item);

        _gameManager.GroupBroadcast(_session, new UpdateCharacterResponse()
        {
            Data = character
        });
    }
}