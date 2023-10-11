namespace NetCoreGameServer.Data.Model;

public class Maze
{
    public Cell[][] Cells { get; set; }
    public Position Position { get; set; }
    public List<Mob> Mobs { get; set; } = new();
}