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
        int numStats = 0;
        numStats += EnhancedEffect != 0 ? 1 : 0;
        numStats += Strength != 0 ? 1 : 0;
        numStats += Dexterity != 0 ? 1 : 0;
        numStats += Vitality != 0 ? 1 : 0;
        numStats += Intelligence != 0 ? 1 : 0;
        numStats += MaxLife != 0 ? 1 : 0;
        numStats += MaxMana != 0 ? 1 : 0;
        numStats += ExperienceGained != 0 ? 1 : 0;
        numStats += MagicLuck != 0 ? 1 : 0;
        numStats += LifeRegen != 0 ? 1 : 0;
        numStats += ManaRegen != 0 ? 1 : 0;
        numStats += ExtraEquipmentSlots != 0 ? 1 : 0;
        numStats += CriticalStrike != 0 ? 1 : 0;
        numStats += LifePerAttack != 0 ? 1 : 0;
        numStats += ManaPerAttack != 0 ? 1 : 0;
        numStats += LifePerKill != 0 ? 1 : 0;
        numStats += ManaPerKill != 0 ? 1 : 0;
        numStats += LifeSteal != 0 ? 1 : 0;
        numStats += DamageReturn != 0 ? 1 : 0;
        numStats += MindNumb != 0 ? 1 : 0;
        numStats += ArmorPierce != 0 ? 1 : 0;
        numStats += Parry != 0 ? 1 : 0;
        numStats += CriticalFlux != 0 ? 1 : 0;
        numStats += PhysicalDamageReduction != 0 ? 1 : 0;
        numStats += MagicalDamageReduction != 0 ? 1 : 0;
        numStats += ManaSiphon != 0 ? 1 : 0;
        numStats += QuickDraw != 0 ? 1 : 0;
        numStats += ManaConsumption != 0 ? 1 : 0;
        numStats += IceMastery != 0 ? 1 : 0;
        numStats += FireMastery != 0 ? 1 : 0;
        numStats += LightningMastery != 0 ? 1 : 0;
        numStats += EarthMastery != 0 ? 1 : 0;
        numStats += WindMastery != 0 ? 1 : 0;
        numStats += HealMastery != 0 ? 1 : 0;
        numStats += ManaSkin != 0 ? 1 : 0;
        numStats += PowerShot != 0 ? 1 : 0;
        numStats += GlancingBlow != 0 ? 1 : 0;
        numStats += Jubilance != 0 ? 1 : 0;
        numStats += WarmLights != 0 ? 1 : 0;
        numStats += EvilPresences != 0 ? 1 : 0;
        numStats += TreasureChests != 0 ? 1 : 0;
        numStats += Rooms != 0 ? 1 : 0;
        numStats += WarmLightEffectiveness != 0 ? 1 : 0;
        numStats += MonsterDifficulty != 0 ? 1 : 0;
        numStats += ItemDrops != 0 ? 1 : 0;
        numStats += ItemQuantity != 0 ? 1 : 0;
        numStats += Swarm != 0 ? 1 : 0;
        numStats += GuildPoints != 0 ? 1 : 0;
        numStats += LevelUp != 0 ? 1 : 0;
        numStats += LevelCap != 0 ? 1 : 0;
        return numStats;
    }

    public ItemStats Clone()
    {
        return (ItemStats)MemberwiseClone();
    }
}