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


    public static Dictionary<ItemSubType, int[]> ForDamageCalculation = new(){
        {ItemSubType.Sword, new [] { 0, 1, 10, 1, 75 } },
        {ItemSubType.Club, new [] { 1, 2, 9, 1, 90 } },
        {ItemSubType.Axe, new [] { 0, 5, 6, 1, 50 } },
        {ItemSubType.Dagger, new [] { 0, 4, 7, 1, 10 } },
        {ItemSubType.Staff, new [] { 1, 3, 8, 1, 25 } },
        {ItemSubType.Longsword, new [] { 0, 2, 20, 2, 75 } },
        {ItemSubType.Warhammer, new [] { 1, 4, 18, 2, 90 } },
        {ItemSubType.Battleaxe, new [] { 0, 10, 12, 2, 50 } },
        {ItemSubType.Spear, new [] { 0, 8, 14, 2, 10 } },
        {ItemSubType.Polearm, new [] { 0, 6, 16, 2, 25 } },
        {ItemSubType.Robe, new [] { 3, 0, 1 } },
        {ItemSubType.PaddedRobe, new [] { 3, 0, 2 } },
        {ItemSubType.LeatherArmor, new [] { 2, 1, 3 } },
        {ItemSubType.ScaleArmor, new [] { 4, 1, 4 } },
        {ItemSubType.ChainMail, new [] { 0, 2, 5 } },
        {ItemSubType.PlateMail, new [] { 0, 2, 6 } },
        {ItemSubType.Ice, new [] { 5, 5, 6 } },
        {ItemSubType.Fire, new [] { 5, 3, 8 } },
        {ItemSubType.Lightning, new [] { 5, 1, 10 } },
        {ItemSubType.Wind, new [] { 5, 2, 9 } },
        {ItemSubType.Earth, new [] { 5, 4, 7 } },
        {ItemSubType.WildHeal, new [] { 5, 1, 10, 1 } },
        {ItemSubType.Heal, new [] { 5, 3, 8, 1 } },
        {ItemSubType.FocusedHeal, new [] { 5, 5, 6, 1 } },
        {ItemSubType.Fish, new [] { 6, -1, -1 } },
        {ItemSubType.Glyph, new [] { 5, -1, -1, 3 } },
        {ItemSubType.Comfrey, new [] { -1, -1, -1 } },
        {ItemSubType.Potion, new [] { 4, -1, -1 } },
        {ItemSubType.Totem, new [] { 1, -1, -1 } },
        {ItemSubType.Map, new [] { 2, -1, -1 } },
        {ItemSubType.FishingRod, new [] { 1, -1, -1 } },
        {ItemSubType.Essence, new [] { 5, -1, -1 } }
    };
}