namespace NetCoreGameServer.Data.Model;

public class GameJWT
{
    public string name { get; set; }
    public string email { get; set; }
    public string id { get; set; }
    public int iat { get; set; }
    public int exp { get; set; }
    public string jti { get; set; }
}