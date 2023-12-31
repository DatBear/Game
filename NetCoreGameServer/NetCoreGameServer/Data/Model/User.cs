﻿namespace NetCoreGameServer.Data.Model;

public class User
{
    public int Id { get; set; }
    public string Username { get; set; }
    public string Email { get; set; }
    public decimal Gold { get; set; }

    public List<Character> Characters { get; set; } = new();
    public int? GuildId { get; set; }
    public List<MarketItem> MarketItems { get; set; } = new();

    //not persisted
    public Character? SelectedCharacter { get; set; }
    public Group? Group { get; set; }
    public Maze? Maze { get; set; }
    public SkillState? CurrentSkill { get; set; }

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