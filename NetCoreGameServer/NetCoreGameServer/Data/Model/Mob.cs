namespace NetCoreGameServer.Data.Model;

public class Mob
{
    public int Id { get; set; }
    public int Image { get; set; }
    public int Position { get; set; }
    public int Life { get; set; }
    public int MaxLife { get; set; }
    public int[] Damage { get; set; }
    public ItemSubType Weapon { get; set; }
}