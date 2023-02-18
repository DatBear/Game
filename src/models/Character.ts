import EquippedItem from "./EquippedItem";
import Item from "./Item";
import { CharacterStats } from "./Stats";

export enum CharacterClass {
  Fighter = "Fighter",
  Barbarian = "Barbarian",
  Rogue = "Rogue",
  Magician = "Magician",
  Guardian = "Guardian",
  Samurai = "Samurai",
  Paladin = "Paladin",
  Monk = "Monk",
  Ninja = "Ninja",
  Warlock = "Warlock",
  Headhunter = "Headhunter",
  Alchemist = "Alchemist"
}

export enum Gender {
  Male = "Male",
  Female = "Female"
}

type Character = {
  id: string;
  name: string;
  level: number;
  guild?: string;
  class: CharacterClass;
  gender: Gender;
  equippedItems: EquippedItem[];
  equipment: Item[];
  items: Item[];
  life: number;
  mana: number;
  experience: number;
  equipmentSlots: number;
  stats: Record<CharacterStats, number>;
}



let defaultCharacterStats: Record<CharacterStats, number> = {
  [CharacterStats.Strength]: 0,
  [CharacterStats.Dexterity]: 0,
  [CharacterStats.Vitality]: 0,
  [CharacterStats.Intelligence]: 0,
  [CharacterStats.MaxLife]: 100,
  [CharacterStats.MaxMana]: 100,
  [CharacterStats.ExperienceGained]: 0,
  [CharacterStats.MagicLuck]: 0,
  [CharacterStats.LifeRegen]: 0,
  [CharacterStats.ManaRegen]: 0,
  [CharacterStats.ExtraEquipmentSlots]: 0,
  [CharacterStats.CriticalStrike]: 0,
  [CharacterStats.LifePerAttack]: 0,
  [CharacterStats.ManaPerAttack]: 0,
  [CharacterStats.LifePerKill]: 0,
  [CharacterStats.ManaPerKill]: 0,
  [CharacterStats.LifeSteal]: 0,
  [CharacterStats.DamageReturn]: 0,
  [CharacterStats.MindNumb]: 0,
  [CharacterStats.ArmorPierce]: 0,
  [CharacterStats.Parry]: 0,
  [CharacterStats.CriticalFlux]: 0,
  [CharacterStats.PhysicalDamageReduction]: 0,
  [CharacterStats.MagicalDamageReduction]: 0,
  [CharacterStats.ManaSyphon]: 0,
  [CharacterStats.QuickDraw]: 0,
  [CharacterStats.ManaConsumption]: 0,
  [CharacterStats.IceMastery]: 0,
  [CharacterStats.FireMastery]: 0,
  [CharacterStats.LightningMastery]: 0,
  [CharacterStats.EarthMastery]: 0,
  [CharacterStats.WindMastery]: 0,
  [CharacterStats.HealMastery]: 0,
  [CharacterStats.ManaSkin]: 0,
  [CharacterStats.PowerShot]: 0,
  [CharacterStats.GlancingBlow]: 0,
  [CharacterStats.Jubilance]: 0
}

function startingStats(str: number, dex: number, int: number, vit: number): Partial<Record<CharacterStats, number>> {
  return { [CharacterStats.Strength]: str, [CharacterStats.Dexterity]: dex, [CharacterStats.Intelligence]: int, [CharacterStats.Vitality]: vit }
}

let classStats: Record<CharacterClass, Partial<Record<CharacterStats, number>>> = {
  [CharacterClass.Fighter]: startingStats(50, 40, 10, 50),
  [CharacterClass.Barbarian]: startingStats(60, 25, 5, 60),
  [CharacterClass.Rogue]: startingStats(30, 60, 25, 35),
  [CharacterClass.Magician]: startingStats(20, 50, 60, 20),
  [CharacterClass.Guardian]: startingStats(30, 10, 55, 55),
  [CharacterClass.Samurai]: startingStats(45, 50, 10, 50),
  [CharacterClass.Paladin]: startingStats(55, 30, 20, 55),
  [CharacterClass.Monk]: startingStats(40, 65, 20, 40),
  [CharacterClass.Ninja]: startingStats(40, 70, 15, 45),
  [CharacterClass.Warlock]: startingStats(15, 45, 75, 35),
  [CharacterClass.Headhunter]: startingStats(55, 75, 5, 35),
  [CharacterClass.Alchemist]: startingStats(10, 40, 110, 15)
}

export { defaultCharacterStats, classStats }
export default Character;