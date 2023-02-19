import Character from "./Character";
import Item, { getItemType, ItemSubType, ItemType } from "./Item";

type CalculatedItemStat = {
  name: string;
  hasStat: (item: Item, character: Character) => boolean;
  value: (item: Item, character: Character) => string;
}

const calculatedItemStats: CalculatedItemStat[] = [
  {
    name: 'Level Req',
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
      return 'some';
    }
  },
  {
    name: 'Spell Damage',
    hasStat: (item, character) => {
      return [ItemSubType.Ice, ItemSubType.Fire, ItemSubType.Lightning, ItemSubType.Wind, ItemSubType.Earth].indexOf(item.subType) > -1;
    },
    value: (item, character) => {
      return 'some';
    }
  },
  {
    name: 'Heals',
    hasStat: (item, character) => {
      return [ItemSubType.WildHeal, ItemSubType.Heal, ItemSubType.FocusedHeal].indexOf(item.subType) > -1;
    },
    value: (item, character) => {
      return 'some';
    }
  },
  {
    name: 'Mana Cost',
    hasStat: (item, character) => {
      return getItemType(item.subType) === ItemType.Charm;
    },
    value: (item, character) => {
      return 'some';
    }
  },
  {
    name: 'Physical Defense',
    hasStat: (item, character) => {
      return getItemType(item.subType) === ItemType.Armor;
    },
    value: (item, character) => {
      return 'some';
    }
  },
  {
    name: 'Magical Defense',
    hasStat: (item, character) => {
      return getItemType(item.subType) === ItemType.Armor;
    },
    value: (item, character) => {
      return 'some';
    }
  }
];

export default calculatedItemStats;