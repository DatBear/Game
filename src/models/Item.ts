
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
  tier: number;
  quantity?: number;
  subType: ItemSubType;
  stats: any[];//todo type
}

let itemTypes: Record<ItemType, ItemSubType[]> = {
  [ItemType.Weapon]: [ItemSubType.Sword, ItemSubType.Club, ItemSubType.Axe, ItemSubType.Dagger, ItemSubType.Staff, ItemSubType.Longsword, ItemSubType.Warhammer, ItemSubType.Battleaxe, ItemSubType.Spear, ItemSubType.Polearm],
  [ItemType.Armor]: [ItemSubType.Robe, ItemSubType.PaddedRobe, ItemSubType.LeatherArmor, ItemSubType.ScaleArmor, ItemSubType.ChainMail, ItemSubType.PlateMail],
  [ItemType.Charm]: [ItemSubType.Ice, ItemSubType.Fire, ItemSubType.Lightning, ItemSubType.Wind, ItemSubType.Earth, ItemSubType.WildHeal, ItemSubType.Heal, ItemSubType.FocusedHeal],
  [ItemType.Item]: [ItemSubType.Fish, ItemSubType.Glyph, ItemSubType.Comfrey, ItemSubType.Potion, ItemSubType.Totem, ItemSubType.Map],
  [ItemType.Object]: [ItemSubType.FishingRod, ItemSubType.Essence]
}

let getItemType = (subType: ItemSubType): ItemType => {
  //todo make this not bad... it actually returns a string......
  //return [...Object.entries(itemTypes)][0][0] as unknown as ItemType;
  return parseInt([...Object.entries(itemTypes)].find((x) => x[1].find(x => x == subType) !== undefined)![0]) as ItemType;
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
  [ItemSubType.PaddedRobe]: "iconPaddedRobe",
  [ItemSubType.LeatherArmor]: "iconLeatherArmor",
  [ItemSubType.ScaleArmor]: "iconScaleArmor",
  [ItemSubType.ChainMail]: "iconChainMail",
  [ItemSubType.PlateMail]: "iconPlateMail",
  [ItemSubType.Ice]: "iconIceCharm",
  [ItemSubType.Fire]: "iconFireCharm",
  [ItemSubType.Lightning]: "iconLightningCharm",
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
  [ItemSubType.FishingRod]: "iconFishingRod",
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

export { itemTypes, getItemType, itemIcons, itemTiers }
export default Item;