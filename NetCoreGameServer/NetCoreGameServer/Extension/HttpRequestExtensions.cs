using NetCoreServer;

namespace NetCoreGameServer.Extension;

public static class HttpRequestExtensions
{
    public static string? GetCookie(this HttpRequest req, string name)
    {
        for (var i = 0; i < req.Cookies; i++)
        {
            var (key, value) = req.Cookie(i);
            if (key == name)
            {
                return value;
            }
        }
        return null;
    }
}