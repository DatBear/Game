using MediatR;
using NetCoreGameServer.Data.Model;
using NetCoreGameServer.Service;
using NetCoreGameServer.Websocket;

namespace NetCoreGameServer.Data.Network.Catacombs;

public class MoveDirectionRequest: BaseRequestPacket<MovementDirection>, IRequest
{
    public override int Type => (int)RequestPacketType.MoveDirection;
}

public class MoveDirectionHandler : IRequestHandler<MoveDirectionRequest>
{
    private readonly GameSession _session;
    private readonly GameManager _gameManager;

    public MoveDirectionHandler(GameSession session, GameManager gameManager)
    {
        _session = session;
        _gameManager = gameManager;
    }

    public async Task Handle(MoveDirectionRequest request, CancellationToken cancellationToken)
    {
        if (_session.User.Group != null && _session.User.Id != _session.User.Group.LeaderId)
        {
            return;
        }

        var maze = _session.User.Group?.Maze ?? _session.User.Maze;

        var newDirection = request.Data switch
        {
            MovementDirection.Left => maze.Position.Direction == Direction.North ? Direction.West : (Direction)((int)maze.Position.Direction >> 1),
            MovementDirection.Right => maze.Position.Direction == Direction.West ? Direction.North : (Direction)((int)maze.Position.Direction << 1),
            MovementDirection.Forward => maze.Position.Direction,
            MovementDirection.TurnAround => maze.Position.Direction <= Direction.East ? (Direction)((int)maze.Position.Direction << 2) : (Direction)((int)maze.Position.Direction >> 2),
            _ => throw new ArgumentOutOfRangeException()
        };
        maze.Position.Direction = newDirection;

        if (request.Data == MovementDirection.Forward)
        {
            MoveForward(maze);
        }
        
        maze.Mobs = MobGenerator.GenerateMobs(_session.User);

        var movePacket = new UpdateMazeResponse
        {
            Data = maze
        };

        if (_session.User.Group != null)
        {
            _gameManager.GroupBroadcast(_session.User.Group, movePacket);
        }
        else
        {
            _session.Send(movePacket);
        }
    }

    private bool CanMoveForward(Maze maze)
    {
        var cell = maze.Cells[maze.Position.Y][maze.Position.X];
        return (cell.Walls & maze.Position.Direction) == 0;
    }

    private void MoveForward(Maze maze)
    {
        if (!CanMoveForward(maze))
        {
            return;
        }

        switch (maze.Position.Direction)
        {
            case Direction.North:
                maze.Position.Y -= 1;
                break;
            case Direction.East:
                maze.Position.X += 1;
                break;
            case Direction.South:
                maze.Position.Y += 1;
                break;
            case Direction.West:
                maze.Position.X -= 1;
                break;
        }

        maze.Cells[maze.Position.Y][maze.Position.X].Visited = true;
    }
}