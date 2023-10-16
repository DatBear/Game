using NetCoreGameServer.Websocket;
using System.Diagnostics;
using NetCoreGameServer.Data.Model;

namespace NetCoreGameServer.Background;

public class CharacterRegenThread : BaseBackgroundThread
{
    private static int RegenInterval = 1000;

    public CharacterRegenThread(GameManager gameManager) : base(gameManager)
    {
    }
    

    protected override async Task Process()
    {
        var tick = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
        var sessions = GameManager.GetSessions();
        foreach (var session in sessions)
        {
            var character = session.User.SelectedCharacter;
            if (character == null || character.LastRegen + RegenInterval > tick) continue;
            if (character is { Zone: Zone.Town })
            {
                character.Life += Math.Min(character.Stats.LifeRegen, character.Stats.MaxLife - character.Life);
                character.Mana += Math.Min(character.Stats.ManaRegen, character.Stats.MaxMana - character.Mana);

                if (tick - character.LastRegen < RegenInterval * 2)
                {
                    character.LastRegen += RegenInterval;
                }
                else
                {
                    character.LastRegen = tick;
                }
                //Console.WriteLine($"{character.Name}'s life: {character.Life}");
            }
        }
    }
    
}