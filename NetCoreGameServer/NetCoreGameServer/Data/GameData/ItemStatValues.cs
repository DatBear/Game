﻿using NetCoreGameServer.Data.Model;

namespace NetCoreGameServer.Data.GameData;

public class ItemStatValues
{
    public static Dictionary<ItemStat, int> MaxPerTier = new()
    {
        { ItemStat.EnhancedEffect, 20 },
        { ItemStat.Strength, 5 },
        { ItemStat.Dexterity, 5 },
        { ItemStat.Vitality, 5 },
        { ItemStat.Intelligence, 5 },
        { ItemStat.MaxLife, 10 },
        { ItemStat.MaxMana, 10 },
        { ItemStat.ExperienceGained, 1 },
        { ItemStat.MagicLuck, 1 },
        { ItemStat.LifeRegen, 2 },
        { ItemStat.ManaRegen, 2 },
        { ItemStat.ExtraEquipmentSlots, 1 },
        { ItemStat.CriticalStrike, 0 },
        { ItemStat.LifePerAttack, 0 },
        { ItemStat.ManaPerAttack, 0 },
        { ItemStat.LifePerKill, 0 },
        { ItemStat.ManaPerKill, 0 },
        { ItemStat.LifeSteal, 0 },
        { ItemStat.DamageReturn, 0 },
        { ItemStat.MindNumb, 0 },
        { ItemStat.ArmorPierce, 0 },
        { ItemStat.Parry, 0 },
        { ItemStat.CriticalFlux, 0 },
        { ItemStat.PhysicalDamageReduction, 0 },
        { ItemStat.MagicalDamageReduction, 0 },
        { ItemStat.ManaSiphon, 0 },
        { ItemStat.QuickDraw, 0 },
        { ItemStat.ManaConsumption, 0 },
        { ItemStat.IceMastery, 2 },
        { ItemStat.FireMastery, 2 },
        { ItemStat.LightningMastery, 2 },
        { ItemStat.EarthMastery, 2 },
        { ItemStat.WindMastery, 2 },
        { ItemStat.HealMastery, 2 },
        { ItemStat.ManaSkin, 0 },
        { ItemStat.PowerShot, 0 },
        { ItemStat.GlancingBlow, 0 },
        { ItemStat.Jubilance, 1 },
        { ItemStat.WarmLights, 0 },
        { ItemStat.EvilPresences, 0 },
        { ItemStat.TreasureChests, 0 },
        { ItemStat.Rooms, 0 },
        { ItemStat.WarmLightEffectiveness, 0 },
        { ItemStat.MonsterDifficulty, 0 },
        { ItemStat.ItemDrops, 0 },
        { ItemStat.ItemQuantity, 0 },
        { ItemStat.Swarm, 0 },
        { ItemStat.GuildPoints, 0 },
        { ItemStat.LevelUp, 0 },
        { ItemStat.LevelCap, 0 },
    };

    public static List<Action<ItemStats>> EssenceActions = new()
    {
        //this is a little deranged
        x => x.EnhancedEffect = 1,
        x => x.Strength = 1,
        x => x.Dexterity = 1,
        x => x.Vitality = 1,
        x => x.Intelligence = 1,
        x => x.MaxLife = 1,
        x => x.MaxMana = 1,
        x => x.ExperienceGained = 1,
        x => x.MagicLuck = 1,
        x => x.LifeRegen = 1,
        x => x.ManaRegen = 1,
        x => x.ExtraEquipmentSlots = 1,
        x => x.CriticalStrike = 1,
    };
}