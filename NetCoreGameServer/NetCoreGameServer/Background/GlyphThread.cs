using System.Collections.Concurrent;
using NetCoreGameServer.Data.Model;
using NetCoreGameServer.Data.Network.Characters;
using NetCoreGameServer.Websocket;

namespace NetCoreGameServer.Background;

//todo persist active glyphs when they're applied, get glyphs from db on startup
public class GlyphThread : BaseBackgroundThread
{
    private ConcurrentQueue<(User user, Item glyph)> _activeGlyphs = new();

    public GlyphThread(GameManager gameManager) : base(1, gameManager)
    {
    }

    protected override async Task Process()
    {
        var tick = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
        while (_activeGlyphs.TryPeek(out var nextExpiring))
        {
            var (user, glyph) = nextExpiring;
            if (glyph.ExpiresAt > tick)
            {
                return;
            }
            
            var character = user.Characters.FirstOrDefault(x => x.ActiveGlyphs.Any(x => x.Id == glyph.Id));
            if (character != null)
            {
                character.Stats -= glyph.Stats;
                character.AllItems.Remove(glyph);
                var session = GameManager.GetSession(user.Id);
                if (session != null)
                {
                    session.Send(new UpdateCharacterResponse
                    {
                        Data = character
                    });
                }
            }

            while (!_activeGlyphs.TryDequeue(out var removed))
            {
                await Task.Delay(50);
            }
        }
    }

    public void UseGlyph(GameSession? session, User? user, Item? glyph)
    {
        if(session == null || user?.SelectedCharacter == null || glyph == null) return;

        glyph.ExpiresAt = DateTimeOffset.UtcNow.AddMinutes(glyph.Tier * 5 * (100 + glyph.Stats.EnhancedEffect) / 100d).ToUnixTimeMilliseconds();
        user.SelectedCharacter.Stats += glyph.Stats;
        _activeGlyphs.Enqueue((user, glyph));
        session.Send(new UpdateCharacterResponse
        {
            Data = user.SelectedCharacter
        });
    }
}