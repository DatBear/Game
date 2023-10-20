using System.Diagnostics;
using NetCoreGameServer.Data.Network.Catacombs;
using NetCoreGameServer.Service;
using NetCoreGameServer.Websocket;

namespace NetCoreGameServer.Background;

public class MobActionThread : BaseBackgroundThread
{
    private static readonly Random r = new();
    private readonly DatabaseThread _dbThread;

    public MobActionThread(GameManager gameManager, DatabaseThread dbThread) : base(20, gameManager)
    {
        _dbThread = dbThread;
    }

    protected override async Task Process()
    {
        var tick = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
        var groups = GameManager.GetGroups();
        foreach (var group in groups)
        {
            foreach (var mob in group.Maze.Mobs)
            {
                var session = GameManager.GetSession(group.Users.FirstOrDefault()?.User.Id);
                if (session != null)
                {
                    var (attack, target) = mob.GetNextAction(group, tick);
                    if (attack == null) continue;
                    //Console.WriteLine($"#{mob.Id} attacked {target.User.Username} for {dmg} damage.");
                    await _dbThread.UpdateCharacter(target.SelectedCharacter);

                    GameManager.GroupBroadcast(session, new AttackTargetResponse
                    {
                        Data = attack
                    });

                    if (target.SelectedCharacter.Life <= 0)
                    {
                        GameManager.OnPlayerDeath(GameManager.GetSession(target.Id), target.SelectedCharacter);
                    }
                }
            }
        }

        var sessions = GameManager.GetUngroupedSessions();
        foreach (var session in sessions)
        {
            if (session.User.Maze == null) continue;
            foreach (var mob in session.User.Maze.Mobs)
            {
                var attack = mob.GetNextAction(session, tick);
                if (attack == null) continue;
                session.Send(new AttackTargetResponse
                {
                    Data = attack
                });

                if (session.User.SelectedCharacter.Life <= 0)
                {
                    GameManager.OnPlayerDeath(session, session.User.SelectedCharacter);
                }
            }
        }
    }

}