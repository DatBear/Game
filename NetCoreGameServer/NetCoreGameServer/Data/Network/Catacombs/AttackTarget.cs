using MediatR;
using NetCoreGameServer.Background;
using NetCoreGameServer.Data.Model;
using NetCoreGameServer.Data.Network.Characters;
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
    private static readonly Random r = new();

    private readonly GameSession _session;
    private readonly GameManager _gameManager;
    private readonly DatabaseThread _dbThread;

    public AttackTargetHandler(GameSession session, GameManager gameManager, DatabaseThread dbThread)
    {
        _session = session;
        _gameManager = gameManager;
        _dbThread = dbThread;
    }

    public async Task Handle(AttackTargetRequest request, CancellationToken cancellationToken)
    {
        var character = _session.User.SelectedCharacter;
        if(character == null) return;

        var attack = request.Data;
        switch (attack.Type)
        {
            case AttackType.PlayerAttack:
                //todo calculate damage, crit, verify source, etc.
                
                attack.Timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
                var weapon = character.AllItems.FirstOrDefault(x => x.EquippedItemSlot == attack.EquippedItemSlot);
                if (weapon?.SubType >= ItemSubType.Ice)
                {
                    var manaCost = (weapon.Tier-1)*8+5;
                    if (character.Mana < manaCost)
                    {
                        return;
                    }
                    character.Mana -= manaCost;
                    await _dbThread.UpdateCharacter(character);
                    _gameManager.GroupBroadcast(_session, new UpdateCharacterResponse
                    {
                        Data = character
                    });
                }
                attack.WeaponType = weapon?.SubType;
                var dmgRange = weapon?.GetRange(character) ?? new []{ 0, 5 };
                var damage = r.Next(dmgRange[0], dmgRange[1]+1);
                attack.Damage = damage;
                attack.IsCritical = false;

                var maze = _session.User.Group?.Maze ?? _session.User.Maze;
                var target = maze.Mobs.FirstOrDefault(x => x.Id == attack.TargetId);
                if (target is { Life: > 0 })
                {
                    target.Life -= damage;
                    attack.TargetHealthResult = target.Life;

                    if (target.Life <= 0)
                    {
                        await _gameManager.OnMobDeath(_session, target);
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