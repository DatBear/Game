import EquippedItem, { EquippedItemSlot } from "./EquippedItem";
import Item, { defaultEquippedItems, ItemSubType } from "./Item";

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
  inventoryItems: Item[];

  inventorySlots: number;
}

export default Character;