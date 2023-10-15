using NetCoreGameServer.Websocket;
using System.Diagnostics;
using NetCoreGameServer.Data.Model;

namespace NetCoreGameServer.Background;

public class CharacterRegenThread
{
    private GameManager _gameManager;
    private static int RegenInterval = 1000;

    public CharacterRegenThread(GameManager gameManager)
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
                await RegenTownCharacters();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }

            await Task.Delay(Math.Max(0, 50 - (int)stopwatch.ElapsedMilliseconds));//20 tick
            stopwatch.Restart();
        }
    }

    private async Task RegenTownCharacters()
    {
        var tick = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
        var sessions = _gameManager.GetSessions();
        foreach (var session in sessions)
        {
            var character = session.User.SelectedCharacter;
            if(character == null || character.LastRegen + RegenInterval > tick) continue;
            if (character is { Zone: Zone.Town })
            {
                character.Life += Math.Min(character.Stats.LifeRegen, character.Stats.MaxLife - character.Life);
                character.Mana += Math.Min(character.Stats.ManaRegen, character.Stats.MaxMana - character.Mana);

                if (tick - character.LastRegen < RegenInterval*2)
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