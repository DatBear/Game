import Character from "./Character";
import MarketItem from "./MarketItem";

type User = {
  id: number;
  name: string;
  characters: Character[];
  selectedCharacter?: Character | null;
  gold: number;
  marketItems: MarketItem[];
};

export default User;