namespace NetCoreGameServer.Data.Model;

public class GroupUser
{
    public User User { get; set; }
    public FightingPosition FightingPosition { get; set; }


    public GroupUser()
    {
    }

    public GroupUser(User user, FightingPosition fightingPosition)
    {
        User = user;
        FightingPosition = fightingPosition;
    }
}