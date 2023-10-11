namespace NetCoreGameServer.Data.Model;

public class Group
{
    public int Id { get; set; }
    public int LeaderId { get; set; }
    public List<GroupUser> Users { get; set; }
    public GroupOptions Options { get; set; }
    public Maze Maze { get; set; }

    public Group ToListResponse()
    {
        return new Group
        {
            Id = Id,
            LeaderId = LeaderId,
            Users = Users,
            Options = Options
        };
    }
}