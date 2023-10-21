import Character from "./Character";
import { EquippedItemSlot } from "./EquippedItem";
import Group from "./Group";
import MarketItem from "./MarketItem";
import { Maze } from "./Maze";

type User = {
  id: number;
  username: string;
  characters: Character[];
  selectedCharacter?: Character | null;
  gold: number;
  marketItems: MarketItem[];
  group?: Group | null;
  maze?: Maze | null;
};

export default User;