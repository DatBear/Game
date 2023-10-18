using MediatR;
using NetCoreGameServer.Data.Model;
using NetCoreGameServer.Data.Network.Characters;
using NetCoreGameServer.Websocket;

namespace NetCoreGameServer.Data.Network.Items;

public class StackItemRequestData
{
    public int ItemId { get; set; }
    public int DraggedItemId { get; set; }
}

public class StackItemRequest : BaseRequestPacket<StackItemRequestData>, IRequest
{
    public override int Type => (int)RequestPacketType.StackItem;
}

public class StackItemHandler : IRequestHandler<StackItemRequest>
{
    private readonly GameSession _session;

    public StackItemHandler(GameSession session)
    {
        _session = session;
    }

    public async Task Handle(StackItemRequest request, CancellationToken cancellationToken)
    {
        var character = _session.User.SelectedCharacter;
        if (character == null) return;
        var item = character?.AllItems.FirstOrDefault(x => x.Id == request.Data.ItemId && x.Quantity.HasValue);
        var draggedItem = character?.AllItems.FirstOrDefault(x => x.Id == request.Data.DraggedItemId && x.Quantity.HasValue);
        if (item == null || draggedItem == null || !item.CanStackWith(draggedItem)) return;

        item.Quantity += draggedItem.Quantity;
        item.Stats.EnhancedEffect += draggedItem.Stats.EnhancedEffect;
        item.Stats.MaxLife += draggedItem.Stats.MaxLife;
        item.Stats.MaxMana += draggedItem.Stats.MaxMana;
        item.Stats.ExperienceGained += draggedItem.Stats.ExperienceGained;

        character.AllItems.Remove(draggedItem);

        _session.Send(new UpdateCharacterResponse
        {
            Data = character
        });
    }
}