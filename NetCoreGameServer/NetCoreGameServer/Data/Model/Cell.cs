namespace NetCoreGameServer.Data.Model;

public class Cell
{
    public Direction Walls { get; set; }
    public int X { get; set; }
    public int Y { get; set; }
    public bool Visited { get; set; }
    //todo warm lights + trapdoors
}