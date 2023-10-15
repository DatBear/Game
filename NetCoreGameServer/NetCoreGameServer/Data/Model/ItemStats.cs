using System.Reflection;
using Newtonsoft.Json;

namespace NetCoreGameServer.Data.Model;

public class ItemStats : Stats
{
    public int WarmLights { get; set; }
    public int EvilPresences { get; set; }
    public int TreasureChests { get; set; }
    public int Rooms { get; set; }
    public int WarmLightEffectiveness { get; set; }
    public int MonsterDifficulty { get; set; }
    public int ItemDrops { get; set; }
    public int ItemQuantity { get; set; }
    public int Swarm { get; set; }
    public int GuildPoints { get; set; }
    public int LevelUp { get; set; }
    public int LevelCap { get; set; }

    public int NumStats()
    {
        var props = typeof(ItemStats).GetProperties(BindingFlags.Public | BindingFlags.Instance).Where(x => x.Name != "Id");
        return props.Count(x => x.PropertyType == typeof(int) && (int)x.GetValue(this) > 0);
    }
}