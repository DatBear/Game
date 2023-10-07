namespace NetCoreGameServer.Websocket;

public class SessionManager
{
    private readonly Dictionary<int, GameSession> _sessions = new();

    public SessionManager()
    {
    }

    public void SetSession(int userId, GameSession session)
    {
        _sessions[userId] = session;
    }

    public GameSession? GetSession(int userId)
    {
        _sessions.TryGetValue(userId, out var session);
        return session;
    }
}