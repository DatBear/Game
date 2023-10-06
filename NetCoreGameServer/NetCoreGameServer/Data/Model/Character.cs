namespace NetCoreGameServer.Data.Model;

public class Character
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int Level { get; set; }
    public int ClassId { get; set; }
    public string @Class { get; set; }
    public Gender Gender { get; set; }
    public Core Core { get; set; }
    public int Life { get; set; }
    public int Mana { get; set; }
    public int Experience { get; set; }
    public int StatPoints { get; set; }
    public int AbilityPoints { get; set; }
    public int EquipmentSlots { get; set; }
    public int Kills { get; set; }
    public int Deaths { get; set; }
    public int StatsId { get; set; }


    public Stats Stats { get; set; }
    public List<Item> EquippedItems { get; set; } = new();
    public List<Item> Equipment { get; set; } = new();
    public List<Item> Items { get; set; } = new();

    public int UserId { get; set; }
}