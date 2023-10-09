import Character from "./Character";
import Group from "./Group";
import MarketItem from "./MarketItem";

type User = {
  id: number;
  username: string;
  characters: Character[];
  selectedCharacter?: Character | null;
  gold: number;
  marketItems: MarketItem[];
  group?: Group | null;
};

export default User;