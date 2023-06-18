namespace NetCoreGameServer.Data.Model;

public class User
{
    public int Id { get; set; }
    public string Username { get; set; }
    public string Email { get; set; }

    public List<Character> Characters { get; set; } = new();
    public int? GuildId { get; set; }
}