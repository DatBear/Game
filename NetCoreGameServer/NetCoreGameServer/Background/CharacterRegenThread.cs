using NetCoreGameServer.Websocket;
using System.Diagnostics;
using NetCoreGameServer.Data.Model;
using NetCoreGameServer.Service;

namespace NetCoreGameServer.Background;

public class CharacterRegenThread : BaseBackgroundThread
{
    private static int RegenInterval = 1000;
    private readonly DatabaseThread _dbThread;

    public CharacterRegenThread(GameManager gameManager, DatabaseThread dbThread) : base(20, gameManager)
    {
        _dbThread = dbThread;
    }
    

    protected override async Task Process()
    {
        var tick = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
        var sessions = GameManager.GetSessions();
        foreach (var session in sessions)
        {
            var character = session.User.SelectedCharacter;
            if (character == null || character.LastRegenAction + RegenInterval > tick) continue;
            if (character is { Zone: Zone.Town })
            {
                if (character.Life < character.Stats.MaxLife || character.Mana < character.Stats.MaxMana)
                {
                    character.Life += Math.Min(character.Stats.LifeRegen, character.Stats.MaxLife - character.Life);
                    character.Mana += Math.Min(character.Stats.ManaRegen, character.Stats.MaxMana - character.Mana);
                    await _dbThread.UpdateCharacter(character);
                }
                
                if (tick - character.LastRegenAction < RegenInterval * 2)
                {
                    character.LastRegenAction += RegenInterval;
                }
                else
                {
                    character.LastRegenAction = tick;
                }
                //Console.WriteLine($"{character.Name}'s life: {character.Life}");
            }
        }
    }
    
}