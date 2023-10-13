using MediatR;
using NetCoreGameServer.Data.Model;
using NetCoreGameServer.Data.Network.Characters;
using NetCoreGameServer.Websocket;

namespace NetCoreGameServer.Data.Network.Catacombs;

public class PickGroundItemRequest: BaseRequestPacket<int>, IRequest
{
    public override int Type => (int)RequestPacketType.PickGroundItem;
}

public class PickGroundItemHandler : IRequestHandler<PickGroundItemRequest>
{
    private static readonly Random r = new();
    private readonly GameSession _session;
    private readonly GameManager _gameManager;

    public PickGroundItemHandler(GameSession session, GameManager gameManager)
    {
        _session = session;
        _gameManager = gameManager;
    }

    public async Task Handle(PickGroundItemRequest request, CancellationToken cancellationToken)
    {
        Task giveItemTask = null;
        var item = _session.User.Group?.Maze.Items.FirstOrDefault(x => x.Item.Id == request.Data) ??
                   _session.User.Maze!.Items.FirstOrDefault(x => x.Item.Id == request.Data);
        if (item == null) return;

        if (item.PickAttempted.All(x => x.Id != _session.User.Id))
        {
            item.PickAttempted.Add(_session.User);
        }

        if (!item.HasGroupClicked)
        {
            item.HasGroupClicked = true;
            item.ExpiresTimestamp = DateTimeOffset.UtcNow.AddSeconds(5).ToUnixTimeMilliseconds();
            giveItemTask = Task.Run(async () =>
            {
                //todo check for full equipment/items
                if (_session.User.Group != null)
                {
                    await Task.Delay(5000);
                }
                if (_session.User == null) return;
                var maze = _session.User.Group?.Maze ?? _session.User.Maze!;
                if(maze == null) return;
                var clickedItem = maze.Items.FirstOrDefault(x => x.Item.Id == item.Item.Id);
                if (clickedItem == null) return;
                var availableWinners = clickedItem.PickAttempted.Where(x => _gameManager.GetSession(x.Id) != null && x.SelectedCharacter != null).ToList();
                var winner = availableWinners[r.Next(availableWinners.Count)];
                if (winner == null) return;
                winner.SelectedCharacter!.AllItems.Add(clickedItem.Item);
                maze.Items.Remove(clickedItem);

                var session = _gameManager.GetSession(winner.Id);
                session.Send(new UpdateCharacterResponse
                {
                    Data = winner.SelectedCharacter
                });
            });
        }


        _gameManager.GroupBroadcast(_session, user =>
        {
            return new UpdateGroundItemResponse
            {
                Data = new GroundItem
                {
                    Item = item.Item,
                    ExpiresTimestamp = item.ExpiresTimestamp,
                    HasGroupClicked = item.PickAttempted.Any(),
                    HasUserClicked = item.PickAttempted.Any(x => x.Id == user.Id)
                }
            };
        });

        if (giveItemTask != null)
        {
            await giveItemTask;
        }
    }
}