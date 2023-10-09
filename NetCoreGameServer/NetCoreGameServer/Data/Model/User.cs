namespace NetCoreGameServer.Data.Model;

public class User
{
    public int Id { get; set; }
    public string Username { get; set; }
    public string Email { get; set; }

    public List<Character> Characters { get; set; } = new();
    public int? GuildId { get; set; }

    //not persisted
    public Character? SelectedCharacter { get; set; }
    public Group? Group { get; set; }

    public GroupUser AsGroupUser(FightingPosition fightingPosition = FightingPosition.Front)
    {
        var user = new User
        {
            Id = Id,
            Username = Username,
            GuildId = GuildId,
            SelectedCharacter = SelectedCharacter
        };
        return new GroupUser(user, fightingPosition);
    }
}