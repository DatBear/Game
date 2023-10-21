using System.Collections.Concurrent;
using System.Collections.Specialized;
using NetCoreGameServer.Data.Model;
using NetCoreGameServer.Data.Network.Characters;
using NetCoreGameServer.Service;
using NetCoreGameServer.Websocket;

namespace NetCoreGameServer.Background;

//todo persist active glyphs when they're applied, get glyphs from db on startup
public class GlyphThread : BaseBackgroundThread
{
    //private ConcurrentQueue<(User user, Item glyph)> _activeGlyphs = new();
    private readonly DatabaseThread _dbThread;
    private readonly SortedList<long, (User user, Item glyph)> _activeGlyphs = new();

    public GlyphThread(GameManager gameManager, DatabaseThread dbThread) : base(1, gameManager)
    {
        _dbThread = dbThread;
    }

    protected override async Task Process()
    {
        var tick = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
        var next = _activeGlyphs.FirstOrDefault();
        while (next.Key > default(long) && next.Key <= tick)
        {
            var (user, glyph) = next.Value;
            if (glyph.ExpiresAt > tick)
            {
                return;
            }

            var character = user.Characters.FirstOrDefault(x => x.ActiveGlyphs.Any(x => x.Id == glyph.Id));
            if (character != null)
            {
                character.Stats -= glyph.Stats;
                character.AllItems.Remove(glyph);
                await _dbThread.DeleteItem(glyph);
                var session = GameManager.GetSession(user.Id);
                if (session != null)
                {
                    session.Send(new UpdateCharacterResponse
                    {
                        Data = character
                    });
                }
            }

            _activeGlyphs.Remove(next.Key);
            next = _activeGlyphs.FirstOrDefault();
        }
    }

    public async Task<bool> UseGlyph(GameSession? session, User? user, Item? glyph)
    {
        if (session == null || user?.SelectedCharacter == null || glyph == null) return false;
        var offset = 0;
        while (_activeGlyphs.ContainsKey(GetExpiration(glyph, offset++)))
        {
        }

        glyph.ExpiresAt = GetExpiration(glyph, offset - 1);
        user.SelectedCharacter.Stats += glyph.Stats;
        await _dbThread.UpdateItem(glyph);
        _activeGlyphs.Add(glyph.ExpiresAt.Value, (user, glyph));
        session.Send(new UpdateCharacterResponse
        {
            Data = user.SelectedCharacter
        });
        return true;
    }

    private long GetExpiration(Item glyph, int offset)
    {
        return DateTimeOffset.UtcNow.AddMinutes(glyph.Tier * 5 * (100 + glyph.Stats.EnhancedEffect) / 100d).ToUnixTimeMilliseconds() + offset;
    }

    public async Task<bool> TrackGlyph(GameSession? session, User? user, Item? glyph)
    {
        if (session == null || user == null || glyph == null) return false;
        if (_activeGlyphs.Any(x => x.Value.glyph.Id == glyph.Id))
        {
            return false;
        }

        var offset = 0;
        while (_activeGlyphs.ContainsKey(glyph.ExpiresAt.Value + offset++))
        {
        }

        _activeGlyphs.Add(glyph.ExpiresAt.Value + offset - 1, (user, glyph));
        return true;
    }
}