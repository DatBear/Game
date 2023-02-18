import Character, { CharacterClass } from "./Character";
import EquippedItem, { EquippedItemSlot } from "./EquippedItem";
import { v4 as uuid } from 'uuid';
import { CharacterStats, ItemStats, Stats } from "./Stats";

export enum ItemType {
  Weapon,
  Armor,
  Charm,
  Item,
  Object
}

export enum ItemSubType {
  Sword,
  Club,
  Axe,
  Dagger,
  Staff,
  Longsword,
  Warhammer,
  Battleaxe,
  Spear,
  Polearm,

  Robe,
  PaddedRobe,
  LeatherArmor,
  ScaleArmor,
  ChainMail,
  PlateMail,

  Ice,
  Fire,
  Lightning,
  Wind,
  Earth,
  WildHeal,
  Heal,
  FocusedHeal,

  Fish,
  Glyph,
  Comfrey,
  Potion,
  Totem,
  Map,

  FishingRod,
  Essence
}

type Item = {
  id: string;
  tier: number;
  quantity?: number;
  subType: ItemSubType;
  stats: Record<Stats, number>;
}



let itemTypes: Record<ItemType, ItemSubType[]> = {
  [ItemType.Weapon]: [ItemSubType.Sword, ItemSubType.Club, ItemSubType.Axe, ItemSubType.Dagger, ItemSubType.Staff, ItemSubType.Longsword, ItemSubType.Warhammer, ItemSubType.Battleaxe, ItemSubType.Spear, ItemSubType.Polearm],
  [ItemType.Armor]: [ItemSubType.Robe, ItemSubType.PaddedRobe, ItemSubType.LeatherArmor, ItemSubType.ScaleArmor, ItemSubType.ChainMail, ItemSubType.PlateMail],
  [ItemType.Charm]: [ItemSubType.Ice, ItemSubType.Fire, ItemSubType.Lightning, ItemSubType.Wind, ItemSubType.Earth, ItemSubType.WildHeal, ItemSubType.Heal, ItemSubType.FocusedHeal],
  [ItemType.Item]: [ItemSubType.Fish, ItemSubType.Glyph, ItemSubType.Comfrey, ItemSubType.Potion, ItemSubType.Totem, ItemSubType.Map],
  [ItemType.Object]: [ItemSubType.FishingRod, ItemSubType.Essence]
}

let getItemType = (subType: ItemSubType): ItemType => {
  //console.log(Object.entries(ItemType));
  //return parseInt([...Object.entries(itemTypes)].find((x) => x[1].find(x => x == subType) !== undefined)![0]) as ItemType;
  return Object.entries(ItemType).find(itemType => itemTypes[itemType[1] as ItemType].find(x => x === subType) !== undefined)![1] as ItemType;
};

let itemIcons: Record<ItemSubType, string> = {
  [ItemSubType.Sword]: "iconSword",
  [ItemSubType.Club]: "iconClub",
  [ItemSubType.Axe]: "iconAxe",
  [ItemSubType.Dagger]: "iconDagger",
  [ItemSubType.Staff]: "iconStaff",
  [ItemSubType.Longsword]: "iconLongsword",
  [ItemSubType.Warhammer]: "iconWarhammer",
  [ItemSubType.Battleaxe]: "iconBattleaxe",
  [ItemSubType.Spear]: "iconSpear",
  [ItemSubType.Polearm]: "iconPolearm",
  [ItemSubType.Robe]: "iconRobe",
  [ItemSubType.PaddedRobe]: "iconPaddedrobe",
  [ItemSubType.LeatherArmor]: "iconLeather",
  [ItemSubType.ScaleArmor]: "iconScale",
  [ItemSubType.ChainMail]: "iconChainmail",
  [ItemSubType.PlateMail]: "iconPlatemail",
  [ItemSubType.Ice]: "iconIceCharm",
  [ItemSubType.Fire]: "iconFireCharm",
  [ItemSubType.Lightning]: "iconLightCharm",
  [ItemSubType.Wind]: "iconWindCharm",
  [ItemSubType.Earth]: "iconEarthCharm",
  [ItemSubType.WildHeal]: "iconWildHealCharm",
  [ItemSubType.Heal]: "iconHealCharm",
  [ItemSubType.FocusedHeal]: "iconFocusedHealCharm",
  [ItemSubType.Fish]: "iconFish",
  [ItemSubType.Glyph]: "iconGlyph",
  [ItemSubType.Comfrey]: "iconComfrey",
  [ItemSubType.Potion]: "iconPotion",
  [ItemSubType.Totem]: "iconTotem",
  [ItemSubType.Map]: "iconMap",
  [ItemSubType.FishingRod]: "iconPole",
  [ItemSubType.Essence]: "iconEssence"
};

let itemTiers: Record<number, string> = {
  [0]: 'U',
  [1]: 'I',
  [2]: 'II',
  [3]: 'III',
  [4]: 'IV',
  [5]: 'V',
  [6]: 'VI',
  [7]: 'VII',
  [8]: 'VIII',
  [9]: 'IX',
  [10]: 'X',
  [11]: 'XI',
  [12]: 'XII',
  [13]: 'XIII',
  [14]: 'XIV'
}

let magicPrefixes: Record<number, string> = {
  [0]: 'Normal',
  [1]: 'Magical',
  [2]: 'Rare',
  [3]: 'Mystical',
  [4]: 'Angelic',
  [5]: 'Mythical',
  [6]: 'Arcane',
  [7]: 'Legendary',
  [8]: 'Godly',
  [9]: 'Epic',
  [10]: 'Relic',
  [11]: 'Artifact',
  [12]: 'Unique'
}

let classWeapons: Record<CharacterClass, ItemSubType[]> = {
  [CharacterClass.Fighter]: [ItemSubType.Sword, ItemSubType.Club, ItemSubType.Axe, ItemSubType.Longsword, ItemSubType.Polearm, ItemSubType.Spear],
  [CharacterClass.Barbarian]: [ItemSubType.Sword, ItemSubType.Club, ItemSubType.Axe, ItemSubType.Warhammer, ItemSubType.Battleaxe, ItemSubType.Polearm],
  [CharacterClass.Rogue]: [ItemSubType.Sword, ItemSubType.Club, ItemSubType.Axe, ItemSubType.Dagger, ItemSubType.Staff, ItemSubType.Spear],
  [CharacterClass.Magician]: [ItemSubType.Staff, ItemSubType.Dagger],
  [CharacterClass.Guardian]: [ItemSubType.Club, ItemSubType.Longsword, ItemSubType.Warhammer, ItemSubType.Battleaxe, ItemSubType.Spear, ItemSubType.Polearm],
  [CharacterClass.Samurai]: [],//todo fill out
  [CharacterClass.Paladin]: [],
  [CharacterClass.Monk]: [],
  [CharacterClass.Ninja]: [],
  [CharacterClass.Warlock]: [],
  [CharacterClass.Headhunter]: [],
  [CharacterClass.Alchemist]: []
}

let classArmors: Record<CharacterClass, ItemSubType[]> = {
  [CharacterClass.Fighter]: [ItemSubType.Robe, ItemSubType.PaddedRobe, ItemSubType.LeatherArmor, ItemSubType.ScaleArmor, ItemSubType.ChainMail, ItemSubType.PlateMail],
  [CharacterClass.Barbarian]: [ItemSubType.Robe, ItemSubType.PaddedRobe, ItemSubType.LeatherArmor, ItemSubType.ScaleArmor, ItemSubType.ChainMail, ItemSubType.PlateMail],
  [CharacterClass.Rogue]: [ItemSubType.Robe, ItemSubType.PaddedRobe, ItemSubType.LeatherArmor, ItemSubType.ScaleArmor],
  [CharacterClass.Magician]: [ItemSubType.Robe, ItemSubType.PaddedRobe],
  [CharacterClass.Guardian]: [ItemSubType.ChainMail, ItemSubType.PlateMail],
  [CharacterClass.Samurai]: [],//todo fill out
  [CharacterClass.Paladin]: [],
  [CharacterClass.Monk]: [],
  [CharacterClass.Ninja]: [],
  [CharacterClass.Warlock]: [],
  [CharacterClass.Headhunter]: [],
  [CharacterClass.Alchemist]: []
};


let allCharms = [...itemTypes[ItemType.Charm]];
let classCharms: Record<CharacterClass, ItemSubType[]> = {
  [CharacterClass.Fighter]: allCharms,
  [CharacterClass.Barbarian]: allCharms,
  [CharacterClass.Rogue]: allCharms,
  [CharacterClass.Magician]: allCharms,
  [CharacterClass.Guardian]: [ItemSubType.WildHeal, ItemSubType.Heal, ItemSubType.FocusedHeal],
  [CharacterClass.Samurai]: allCharms,
  [CharacterClass.Paladin]: allCharms,
  [CharacterClass.Monk]: allCharms,
  [CharacterClass.Ninja]: allCharms,
  [CharacterClass.Warlock]: allCharms,
  [CharacterClass.Headhunter]: [ItemSubType.Lightning],
  [CharacterClass.Alchemist]: allCharms
}

let defaultItemStats: Record<ItemStats, number> = {
  [ItemStats.WarmLights]: 0,
  [ItemStats.EvilPresences]: 0,
  [ItemStats.TreasureChests]: 0,
  [ItemStats.Rooms]: 0,
  [ItemStats.WarmLightEffectiveness]: 0,
  [ItemStats.MonsterDifficulty]: 0,
  [ItemStats.ExperienceGained]: 0,
  [ItemStats.ItemDrops]: 0,
  [ItemStats.ItemQuality]: 0,
  [ItemStats.Swarm]: 0,
  [ItemStats.GuildPoints]: 0,
  [ItemStats.LevelUp]: 0,
  [ItemStats.LevelCap]: 0
}

let defaultStats: Record<Stats, number> = {
  [CharacterStats.Strength]: 0,
  [CharacterStats.Dexterity]: 0,
  [CharacterStats.Vitality]: 0,
  [CharacterStats.Intelligence]: 0,
  [CharacterStats.MaxLife]: 0,
  [CharacterStats.MaxMana]: 0,
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
  [CharacterStats.Jubilance]: 0,
  ...defaultItemStats
}

let defaultItem = (subType: ItemSubType) => {
  return {
    id: uuid(),
    stats: { ...defaultStats },
    subType: subType,
    tier: 1,
  } as Item;
};

let defaultEquippedItems: Record<CharacterClass, EquippedItem[]> = {
  [CharacterClass.Fighter]: [{ slot: EquippedItemSlot.Weapon, item: defaultItem(ItemSubType.Sword) }],
  [CharacterClass.Barbarian]: [{ slot: EquippedItemSlot.Weapon, item: defaultItem(ItemSubType.Club) }],
  [CharacterClass.Rogue]: [
    { slot: EquippedItemSlot.Weapon, item: defaultItem(ItemSubType.Dagger) },
    { slot: EquippedItemSlot.Armor, item: defaultItem(ItemSubType.ScaleArmor) },//todo remove
    { slot: EquippedItemSlot.Charm, item: defaultItem(ItemSubType.Lightning) }
  ],
  [CharacterClass.Magician]: [
    { slot: EquippedItemSlot.Weapon, item: defaultItem(ItemSubType.Staff) },
    { slot: EquippedItemSlot.Charm, item: defaultItem(ItemSubType.Fire) }
  ],
  [CharacterClass.Guardian]: [
    { slot: EquippedItemSlot.Weapon, item: defaultItem(ItemSubType.Club) },
    { slot: EquippedItemSlot.Charm, item: defaultItem(ItemSubType.Heal) }
  ],
  [CharacterClass.Samurai]: [], [CharacterClass.Paladin]: [], [CharacterClass.Monk]: [], [CharacterClass.Ninja]: [],
  [CharacterClass.Warlock]: [], [CharacterClass.Headhunter]: [], [CharacterClass.Alchemist]: []
}

export { itemTypes, getItemType, itemIcons, itemTiers, classWeapons, classArmors, classCharms, defaultEquippedItems, defaultStats }
export default Item;