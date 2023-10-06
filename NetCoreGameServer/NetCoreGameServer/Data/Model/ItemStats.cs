﻿namespace NetCoreGameServer.Data.Model;

public class ItemStats
{
    public int StatsId { get; set; }
    public Stats Stats { get; set; }
    public int WarmLights { get; set; }
    public int EvilPresences { get; set; }
    public int TreasureChests { get; set; }
    public int Rooms { get; set; }
    public int WarmLightEffectiveness { get; set; }
    public int MonsterDifficulty { get; set; }
    public int ExperienceGained { get; set; }
    public int ItemDrops { get; set; }
    public int ItemQuantity { get; set; }
    public int Swarm { get; set; }
    public int GuildPoints { get; set; }
    public int LevelUp { get; set; }
    public int LevelCap { get; set; }
}