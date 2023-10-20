import Character from "./Character";
import Item, { getItemType, ItemSubType, ItemType } from "./Item";

type CalculatedItemStat = {
  name: string;
  class?: (item: Item, character: Character) => string;
  hasStat: (item: Item, character: Character) => boolean;
  value: (item: Item, character: Character) => string;
}

const itemData: Record<ItemSubType, number[]> = {
  [ItemSubType.Sword]: [0, 1, 10, 1, 75],
  [ItemSubType.Club]: [1, 2, 9, 1, 90],
  [ItemSubType.Axe]: [0, 5, 6, 1, 50],
  [ItemSubType.Dagger]: [0, 4, 7, 1, 10],
  [ItemSubType.Staff]: [1, 3, 8, 1, 25],
  [ItemSubType.Longsword]: [0, 2, 20, 2, 75],
  [ItemSubType.Warhammer]: [1, 4, 18, 2, 90],
  [ItemSubType.Battleaxe]: [0, 10, 12, 2, 50],
  [ItemSubType.Spear]: [0, 8, 14, 2, 10],
  [ItemSubType.Polearm]: [0, 6, 16, 2, 25],
  [ItemSubType.Robe]: [3, 0, 1],
  [ItemSubType.PaddedRobe]: [3, 0, 2],
  [ItemSubType.LeatherArmor]: [2, 1, 3],
  [ItemSubType.ScaleArmor]: [4, 1, 4],
  [ItemSubType.ChainMail]: [0, 2, 5],
  [ItemSubType.PlateMail]: [0, 2, 6],
  [ItemSubType.Ice]: [5, 5, 6],
  [ItemSubType.Fire]: [5, 3, 8],
  [ItemSubType.Lightning]: [5, 1, 10],
  [ItemSubType.Wind]: [5, 2, 9],
  [ItemSubType.Earth]: [5, 4, 7],
  [ItemSubType.WildHeal]: [5, 1, 10, 1],
  [ItemSubType.Heal]: [5, 3, 8, 1],
  [ItemSubType.FocusedHeal]: [5, 5, 6, 1],
  [ItemSubType.Fish]: [6, -1, -1],
  [ItemSubType.Glyph]: [5, -1, -1, 3],
  [ItemSubType.Comfrey]: [-1, -1, -1],
  [ItemSubType.Potion]: [4, -1, -1],
  [ItemSubType.Totem]: [1, -1, -1],
  [ItemSubType.Map]: [2, -1, -1],
  [ItemSubType.FishingRod]: [1, -1, -1],
  [ItemSubType.Essence]: [5, -1, -1]
}

const getCalcStat = (perTier: number, itemTier: number, statDamage: number, ee: number) => {
  return Math.floor((perTier * itemTier) * (100 + statDamage - 5) / 100 * ((100 + ee) / 100));
}

const calculatedItemStats: CalculatedItemStat[] = [
  {
    name: 'Level Req',
    class: (item, character) => {
      return character.level < (item.tier - 3) * 5 ? "text-red-500" : "";
    },
    hasStat: (item, character) => {
      return item.tier > 3;
    },
    value: (item, character) => {
      return '' + ((item.tier - 3) * 5);
    }
  },
  {
    name: 'Damage',
    hasStat: (item, character) => {
      return getItemType(item.subType) === ItemType.Weapon;
    },
    value: (item, character) => {
      var data = itemData[item.subType];
      var statDamage = Math.floor(character.stats.strength * data[4] / 100) + Math.floor(character.stats.dexterity * (100 - data[4]) / 100);
      statDamage = Math.floor(statDamage * 1.25);
      return getCalcStat(data[1], item.tier, statDamage, item.stats.enhancedEffect ?? 0) + " to " + getCalcStat(data[2], item.tier, statDamage, item.stats.enhancedEffect ?? 0);
    }
  },
  {
    name: 'Spell Damage',
    hasStat: (item, character) => {
      return [ItemSubType.Ice, ItemSubType.Fire, ItemSubType.Lightning, ItemSubType.Wind, ItemSubType.Earth].indexOf(item.subType) > -1;
    },
    value: (item, character) => {
      var data = itemData[item.subType];
      let ee = (item.stats.enhancedEffect ?? 0) + (item.stats.intelligence ?? 0);
      return getCalcStat(data[1], item.tier, character.stats.intelligence ?? 0, ee) + " to " + getCalcStat(data[2], item.tier, character.stats.intelligence ?? 0, ee);
    }
  },
  {
    name: 'Heals',
    hasStat: (item, character) => {
      return [ItemSubType.WildHeal, ItemSubType.Heal, ItemSubType.FocusedHeal].indexOf(item.subType) > -1;
    },
    value: (item, character) => {
      var data = itemData[item.subType];
      let ee = (item.stats.enhancedEffect ?? 0) + (item.stats.intelligence ?? 0);
      return getCalcStat(data[1], item.tier, character.stats.intelligence ?? 0, ee) + " to " + getCalcStat(data[2], item.tier, character.stats.intelligence ?? 0, ee);
    }
  },
  {
    name: 'Mana Cost',
    hasStat: (item, character) => {
      return getItemType(item.subType) === ItemType.Charm;
    },
    value: (item, character) => {

      return '' + (8 * (item.tier - 1) + 5);
    }
  },
  {
    name: 'Physical Defense',
    hasStat: (item, character) => {
      return getItemType(item.subType) === ItemType.Armor;
    },
    value: (item, character) => {
      var data = itemData[item.subType];
      let ee = item.stats.enhancedEffect ?? 0;
      return getCalcStat(data[1], item.tier, character.stats.vitality, ee) + " to " + getCalcStat(data[2], item.tier, character.stats.vitality, ee);
    }
  },
  {
    name: 'Magical Defense',
    hasStat: (item, character) => {
      return getItemType(item.subType) === ItemType.Armor;
    },
    value: (item, character) => {
      var data = itemData[item.subType];
      let ee = item.stats.enhancedEffect ?? 0;
      return getCalcStat(2 - data[1], item.tier, character.stats.intelligence, ee) + " to " + getCalcStat(7 - data[2], item.tier, character.stats.intelligence, ee);
    }
  },
  {
    name: 'Duration',
    hasStat: (item, character) => {
      return item.subType === ItemSubType.Glyph;
    },
    value: (item, character) => {
      var secs = item.tier * 5 * (100 + (item.stats.enhancedEffect ?? 0)) / 100 * 60;
      if (item.expiresAt) {
        secs = Math.floor(Math.max(0, (item.expiresAt - new Date().getTime()) / 1000));
      }
      var mins = Math.floor(secs / 60);
      var minString = mins > 0 ? `${mins} minute${mins > 1 ? 's' : ''}` : '';
      var secString = secs % 60 > 0 ? `, ${secs % 60} second${secs % 60 != 1 ? 's' : ''}` : '';
      return `${minString}${secString}`;
    }
  }
];

export default calculatedItemStats;