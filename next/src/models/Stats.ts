import Character from "./Character";
import Item, { getItemType, ItemType } from "./Item";

type CharacterStats = {
  enhancedEffect: number;
  strength: number;
  dexterity: number;
  vitality: number;
  intelligence: number;
  maxLife: number;
  maxMana: number;
  experienceGained: number;
  magicLuck: number;
  lifeRegen: number;
  manaRegen: number;
  extraEquipmentSlots: number;
  criticalStrike: number;
  lifePerAttack: number;
  manaPerAttack: number;
  lifePerKill: number;
  manaPerKill: number;
  lifeSteal: number;
  damageReturn: number;
  mindNumb: number;
  armorPierce: number;
  parry: number;
  criticalFlux: number;
  physicalDamageReduction: number;
  magicalDamageReduction: number;
  manaSiphon: number;
  quickDraw: number;
  manaConsumption: number;
  iceMastery: number;
  fireMastery: number;
  lightningMastery: number;
  earthMastery: number;
  windMastery: number;
  healMastery: number;
  manaSkin: number;
  powerShot: number;
  glancingBlow: number;
  jubilance: number;
}

type ItemStats = {
  warmLights: number;
  evilPresences: number;
  treasureChests: number;
  rooms: number;
  warmLightEffectiveness: number;
  monsterDifficulty: number;
  experienceGained: number;
  itemDrops: number;
  itemQuality: number;
  swarm: number;
  guildPoints: number;
  levelUp: number;
  levelCap: number;
}

const statNames: Record<string, string> = {
  ["enhancedEffect"]: "% Enhanced Effect",
  ["strength"]: "Strength",
  ["dexterity"]: "Dexterity",
  ["vitality"]: "Vitality",
  ["intelligence"]: "Intelligence",
  ["maxLife"]: "Max Life",
  ["maxMana"]: "Max Mana",
  ["experienceGained"]: "% Experience Gained",
  ["magicLuck"]: "Magic Luck",
  ["lifeRegen"]: "Life Regen",
  ["manaRegen"]: "Mana Regen",
  ["extraEquipmentSlots"]: "Extra Equipment Slots",
  ["criticalStrike"]: "Critical Strike",
  ["lifePerAttack"]: "Life PerAttack",
  ["manaPerAttack"]: "Mana Per Attack",
  ["lifePerKill"]: "Life Per Kill",
  ["manaPerKill"]: "Mana Per Kill",
  ["lifeSteal"]: "% Life Steal",
  ["damageReturn"]: "% Damage Return",
  ["mindNumb"]: "% Mind Numb",
  ["armorPierce"]: "% Armor Pierce",
  ["parry"]: "% Parry",
  ["criticalFlux"]: "% Critical Flux",
  ["physicalDamageReduction"]: "% Physical Damage Reduction",
  ["magicalDamageReduction"]: "% Magical Damage Reduction",
  ["manaSiphon"]: "% Mana Syphon",
  ["quickDraw"]: "% Quick Draw",
  ["manaConsumption"]: "% Mana Consumption",
  ["iceMastery"]: "% Ice Mastery",
  ["fireMastery"]: "% Fire Mastery",
  ["lightningMastery"]: "% Lightning Mastery",
  ["earthMastery"]: "% Earth Mastery",
  ["windMastery"]: "% Wind Mastery",
  ["healMastery"]: "% Heal Mastery",
  ["manaSkin"]: "% Mana Skin",
  ["powerShot"]: "% Power Shot",
  ["glancingBlow"]: "% Glancing Blow",
  ["jubilance"]: "Jubilance",
  ["warmLights"]: "Warm Lights",
  ["evilPresences"]: "Evil Presences",
  ["treasureChests"]: "Treasure Chests",
  ["rooms"]: "Rooms",
  ["warmLightEffectiveness"]: "% Warm Light Effectiveness",
  ["monsterDifficulty"]: "% Monster Difficulty",
  ["itemDrops"]: "% Item Drops",
  ["itemQuality"]: "% Item Quality",
  ["swarm"]: "% Swarm",
  ["guildPoints"]: "% Guild Points",
  ["levelUp"]: "% Level Up",
  ["levelCap"]: "Level Cap"
}

type Stats = Partial<CharacterStats> & Partial<ItemStats> & {
  id: number;
};

const itemSpecificStatNames: Record<string, string> = {
  ...statNames,
  ["maxLife"]: "Heals {x} Life",
  ["maxMana"]: "Recovers {x} Mana",
  ["experienceGained"]: "{x}% Cooked"
}


export { statNames, itemSpecificStatNames }


export type {
  Stats, CharacterStats, ItemStats
};