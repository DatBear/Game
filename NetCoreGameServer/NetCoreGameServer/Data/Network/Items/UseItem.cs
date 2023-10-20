using MediatR;
using NetCoreGameServer.Data.Model;
using NetCoreGameServer.Websocket;
using System.Data;
using NetCoreGameServer.Background;
using NetCoreGameServer.Service;

namespace NetCoreGameServer.Data.Network.Items;

public class UseItemRequestData
{
    public int ItemId { get; set; }
    public int TargetId { get; set; }
}

public class UseItemRequest : BaseRequestPacket<UseItemRequestData>, IRequest
{
    public override int Type => (int)RequestPacketType.UseItem;
}

public class UseItemRequestHandler : IRequestHandler<UseItemRequest>
{
    private readonly GameSession _session;
    private readonly GlyphThread _glyphThread;
    private readonly DatabaseThread _dbThread;

    private static List<ItemSubType> _usableItems = new()
    {
        ItemSubType.Fish,
        ItemSubType.Totem,
        ItemSubType.Glyph,
        ItemSubType.Map,
        ItemSubType.Potion,
    };

    public UseItemRequestHandler(GameSession session, GlyphThread glyphThread, DatabaseThread dbThread)
    {
        _session = session;
        _glyphThread = glyphThread;
        _dbThread = dbThread;
    }

    public async Task Handle(UseItemRequest request, CancellationToken cancellationToken)
    {
        var item = _session.User.SelectedCharacter?.AllItems.FirstOrDefault(x => x.Id == request.Data.ItemId);
        if (item == null || !_usableItems.Contains(item.SubType)) return;
        var targetUser = _session.User;
        var target = _session.User.SelectedCharacter!.Id == request.Data.TargetId ? targetUser?.SelectedCharacter : null;
        if (target == null)
        {
            targetUser = _session.User.Group?.Users.FirstOrDefault(x => x.User.SelectedCharacter?.Id == request.Data.TargetId)?.User;
            target = targetUser?.SelectedCharacter;
        }
        if (targetUser == null || target == null) return;

        switch (item.SubType)
        {
            case ItemSubType.Fish:
            case ItemSubType.Potion:
                target.Life += (int)Math.Min(target.Stats.MaxLife - target.Life, item.Stats.MaxLife / (item.Quantity ?? 1d));
                target.Mana += (int)Math.Min(target.Stats.MaxMana - target.Mana, item.Stats.MaxMana / (item.Quantity ?? 1d));
                if (item.Unstack(1))
                {
                    target.AllItems.Remove(item);
                    await _dbThread.DeleteItem(item);
                }
                else
                {
                    await _dbThread.UpdateItem(item);
                }
                break;
            case ItemSubType.Glyph:
                await _glyphThread.UseGlyph(_session, targetUser, item);
                break;
        }
    }
}