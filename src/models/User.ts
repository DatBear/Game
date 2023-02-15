import Character from "./Character";

type User = {
  id: number;
  name: string;
  characters: Character[];
  selectedCharacter?: Character | null;
  gold: number;
};

export default User;