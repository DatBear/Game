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


type Character = {
  name: string;
  level: number;
  guild?: string;
  class: CharacterClass;
}

export default Character;