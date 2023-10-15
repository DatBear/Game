using MediatR;
using NetCoreGameServer.Data.Model;
using NetCoreGameServer.Service;
using NetCoreGameServer.Websocket;

namespace NetCoreGameServer.Data.Network.Catacombs;

public class AttackTargetRequest : BaseRequestPacket<Attack>, IRequest
{
    public override int Type => (int)RequestPacketType.AttackTarget;
}

public class AttackTargetResponse : BaseResponsePacket<Attack>, IRequest
{
    public override int Type => (int)ResponsePacketType.AttackTarget;
}

public class AttackTargetHandler : IRequestHandler<AttackTargetRequest>
{
    private readonly GameSession _session;
    private readonly GameManager _gameManager;

    public AttackTargetHandler(GameSession session, GameManager gameManager)
    {
        _session = session;
        _gameManager = gameManager;
    }

    public async Task Handle(AttackTargetRequest request, CancellationToken cancellationToken)
    {
        var attack = request.Data;
        switch (attack.Type)
        {
            case AttackType.PlayerAttack:
                //todo calculate damage, crit, verify source, etc.
                attack.Damage = 25;
                attack.IsCritical = false;
                
                attack.Timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
                var weapon = _session.User.SelectedCharacter.AllItems.FirstOrDefault(x => x.EquippedItemSlot == attack.EquippedItemSlot);
                attack.WeaponType = weapon?.SubType;

                var maze = _session.User.Group?.Maze ?? _session.User.Maze;
                var target = maze.Mobs.FirstOrDefault(x => x.Id == attack.TargetId);
                if (target is { Life: > 0 })
                {
                    target.Life -= 25;
                    attack.TargetHealthResult = target.Life;

                    if (target.Life <= 0)
                    {
                        _gameManager.OnMobDeath(_session, target);
                    }

                    //Console.WriteLine($"user attacked mob #{target.Id}");
                    _gameManager.GroupBroadcast(_session, new AttackTargetResponse()
                    {
                        Data = attack
                    });
                }
                break;
        }

    }
}