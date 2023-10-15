using System.Diagnostics;
using NetCoreGameServer.Data.Network.Catacombs;
using NetCoreGameServer.Websocket;

namespace NetCoreGameServer.Background;

public class MobActionThread
{
    private static readonly Random r = new();
    private readonly GameManager _gameManager;


    public MobActionThread(GameManager gameManager)
    {
        _gameManager = gameManager;
    }

    public async Task Run()
    {
        var stopwatch = new Stopwatch();
        while (true)
        {
            try
            {
                await DoMobActions();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }

            await Task.Delay(Math.Max(0, 50 - (int)stopwatch.ElapsedMilliseconds));//20 tick
            stopwatch.Restart();
        }
    }

    private async Task DoMobActions()
    {
        var tick = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
        var groups = _gameManager.GetGroups();
        foreach (var group in groups)
        {
            foreach (var mob in group.Maze.Mobs)
            {
                var session = _gameManager.GetSession(group.Users.FirstOrDefault()?.User.Id);
                if (session != null)
                {
                    var (attack, target) = mob.GetNextAction(group, tick);
                    if (attack == null) continue;
                    //Console.WriteLine($"#{mob.Id} attacked {target.User.Username} for {dmg} damage.");
                    
                    _gameManager.GroupBroadcast(session, new AttackTargetResponse
                    {
                        Data = attack
                    });

                    if (target.SelectedCharacter.Life <= 0)
                    {
                        _gameManager.OnPlayerDeath(_gameManager.GetSession(target.Id), target.SelectedCharacter);
                    }
                }
            }
        }

        var sessions = _gameManager.GetUngroupedSessions();
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
                    _gameManager.OnPlayerDeath(session, session.User.SelectedCharacter);
                }
            }
        }
    }
}