﻿using MediatR;
using NetCoreGameServer.Background;
using NetCoreGameServer.Data.Model;
using NetCoreGameServer.Data.Network.Characters;
using NetCoreGameServer.Service;
using NetCoreGameServer.Websocket;

namespace NetCoreGameServer.Data.Network.Catacombs;

public class PickGroundItemRequest : BaseRequestPacket<int>, IRequest
{
    public override int Type => (int)RequestPacketType.PickGroundItem;
}

public class PickGroundItemHandler : IRequestHandler<PickGroundItemRequest>
{
    private static readonly Random r = new();
    private readonly GameSession _session;
    private readonly GameManager _gameManager;
    private readonly DatabaseThread _dbThread;

    public PickGroundItemHandler(GameSession session, GameManager gameManager, DatabaseThread dbThread)
    {
        _session = session;
        _gameManager = gameManager;
        _dbThread = dbThread;
    }

    public async Task Handle(PickGroundItemRequest request, CancellationToken cancellationToken)
    {
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
            item.ExpiresTimestamp = _session.User.Group == null ? DateTimeOffset.UtcNow.ToUnixTimeMilliseconds() : DateTimeOffset.UtcNow.AddSeconds(5).ToUnixTimeMilliseconds();
            _ = Task.Run(async () =>
            {
                if (_session.User.Group != null)
                {
                    await Task.Delay(5000);
                }

                if (_session.User == null) return;
                var maze = _session.User.Group?.Maze ?? _session.User.Maze;
                if (maze == null) return;
                var clickedItem = maze.Items.FirstOrDefault(x => x.Item.Id == item.Item.Id);
                if (clickedItem == null) return;
                var winner = clickedItem.FindWinner(_gameManager);
                if (winner == null) return;
                winner.SelectedCharacter!.AllItems.Add(clickedItem.Item);
                clickedItem.Item.OwnerId = winner.SelectedCharacter.Id;
                maze.Items.Remove(clickedItem);
                await _dbThread.CreateItem(item.Item);

                var session = _gameManager.GetSession(winner.Id);
                session?.Send(new UpdateCharacterResponse
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
    }
}