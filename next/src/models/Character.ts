import { RefObject } from "react";
import Item from "./Item";
import { CharacterStats } from "./Stats";
import { Zone } from "./Zone";
import { EquippedItemSlot } from "./EquippedItem";

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
  Male,
  Female
}

type Character = {
  id: number;
  name: string;
  level: number;
  guild?: string;
  class: CharacterClass;
  gender: Gender;
  equippedItems: Item[];
  equipment: Item[];
  items: Item[];
  life: number;
  mana: number;
  experience: number;
  statPoints: number;
  abilityPoints: number;
  equipmentSlots: number;
  kills: number;
  deaths: number;
  stats: CharacterStats;
  zone: Zone;
  imageRef: RefObject<HTMLDivElement>;
  lastRegenAction: number;
  activeGlyphs: Item[];
}

export default Character;