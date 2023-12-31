﻿using Newtonsoft.Json;

namespace NetCoreGameServer.Data.Model;

public class Stats
{
    [JsonIgnore]
    public int Id { get; set; }
    public int EnhancedEffect { get; set; }
    public int Strength { get; set; }
    public int Dexterity { get; set; }
    public int Vitality { get; set; }
    public int Intelligence { get; set; }
    public int MaxLife { get; set; }
    public int MaxMana { get; set; }
    public int ExperienceGained { get; set; }
    public int MagicLuck { get; set; }
    public int LifeRegen { get; set; }
    public int ManaRegen { get; set; }
    public int ExtraEquipmentSlots { get; set; }
    public int CriticalStrike { get; set; }
    public int LifePerAttack { get; set; }
    public int ManaPerAttack { get; set; }
    public int LifePerKill { get; set; }
    public int ManaPerKill { get; set; }
    public int LifeSteal { get; set; }
    public int DamageReturn { get; set; }
    public int MindNumb { get; set; }
    public int ArmorPierce { get; set; }
    public int Parry { get; set; }
    public int CriticalFlux { get; set; }
    public int PhysicalDamageReduction { get; set; }
    public int MagicalDamageReduction { get; set; }
    public int ManaSiphon { get; set; }
    public int QuickDraw { get; set; }
    public int ManaConsumption { get; set; }
    public int IceMastery { get; set; }
    public int FireMastery { get; set; }
    public int LightningMastery { get; set; }
    public int EarthMastery { get; set; }
    public int WindMastery { get; set; }
    public int HealMastery { get; set; }
    public int ManaSkin { get; set; }
    public int PowerShot { get; set; }
    public int GlancingBlow { get; set; }
    public int Jubilance { get; set; }

    public static Stats operator +(Stats a, Stats b)
    {
        a.EnhancedEffect += b.EnhancedEffect;
        a.Strength += b.Strength;
        a.Dexterity += b.Dexterity;
        a.Vitality += b.Vitality;
        a.Intelligence += b.Intelligence;
        a.MaxLife += b.MaxLife;
        a.MaxMana += b.MaxMana;
        a.ExperienceGained += b.ExperienceGained;
        a.MagicLuck += b.MagicLuck;
        a.LifeRegen += b.LifeRegen;
        a.ManaRegen += b.ManaRegen;
        a.ExtraEquipmentSlots += b.ExtraEquipmentSlots;
        a.CriticalStrike += b.CriticalStrike;
        a.LifePerAttack += b.LifePerAttack;
        a.ManaPerAttack += b.ManaPerAttack;
        a.LifePerKill += b.LifePerKill;
        a.ManaPerKill += b.ManaPerKill;
        a.LifeSteal += b.LifeSteal;
        a.DamageReturn += b.DamageReturn;
        a.MindNumb += b.MindNumb;
        a.ArmorPierce += b.ArmorPierce;
        a.Parry += b.Parry;
        a.CriticalFlux += b.CriticalFlux;
        a.PhysicalDamageReduction += b.PhysicalDamageReduction;
        a.MagicalDamageReduction += b.MagicalDamageReduction;
        a.ManaSiphon += b.ManaSiphon;
        a.QuickDraw += b.QuickDraw;
        a.ManaConsumption += b.ManaConsumption;
        a.IceMastery += b.IceMastery;
        a.FireMastery += b.FireMastery;
        a.LightningMastery += b.LightningMastery;
        a.EarthMastery += b.EarthMastery;
        a.WindMastery += b.WindMastery;
        a.HealMastery += b.HealMastery;
        a.ManaSkin += b.ManaSkin;
        a.PowerShot += b.PowerShot;
        a.GlancingBlow += b.GlancingBlow;
        a.Jubilance += b.Jubilance;
        return a;
    }

    public static Stats operator -(Stats a, Stats b)
    {
        a.EnhancedEffect -= b.EnhancedEffect;
        a.Strength -= b.Strength;
        a.Dexterity -= b.Dexterity;
        a.Vitality -= b.Vitality;
        a.Intelligence -= b.Intelligence;
        a.MaxLife -= b.MaxLife;
        a.MaxMana -= b.MaxMana;
        a.ExperienceGained -= b.ExperienceGained;
        a.MagicLuck -= b.MagicLuck;
        a.LifeRegen -= b.LifeRegen;
        a.ManaRegen -= b.ManaRegen;
        a.ExtraEquipmentSlots -= b.ExtraEquipmentSlots;
        a.CriticalStrike -= b.CriticalStrike;
        a.LifePerAttack -= b.LifePerAttack;
        a.ManaPerAttack -= b.ManaPerAttack;
        a.LifePerKill -= b.LifePerKill;
        a.ManaPerKill -= b.ManaPerKill;
        a.LifeSteal -= b.LifeSteal;
        a.DamageReturn -= b.DamageReturn;
        a.MindNumb -= b.MindNumb;
        a.ArmorPierce -= b.ArmorPierce;
        a.Parry -= b.Parry;
        a.CriticalFlux -= b.CriticalFlux;
        a.PhysicalDamageReduction -= b.PhysicalDamageReduction;
        a.MagicalDamageReduction -= b.MagicalDamageReduction;
        a.ManaSiphon -= b.ManaSiphon;
        a.QuickDraw -= b.QuickDraw;
        a.ManaConsumption -= b.ManaConsumption;
        a.IceMastery -= b.IceMastery;
        a.FireMastery -= b.FireMastery;
        a.LightningMastery -= b.LightningMastery;
        a.EarthMastery -= b.EarthMastery;
        a.WindMastery -= b.WindMastery;
        a.HealMastery -= b.HealMastery;
        a.ManaSkin -= b.ManaSkin;
        a.PowerShot -= b.PowerShot;
        a.GlancingBlow -= b.GlancingBlow;
        a.Jubilance -= b.Jubilance;
        return a;
    }
}