import Character from "./Character";

type Group = {
  id: string;
  characters: Character[];
  leader: Character;
}

export default Group;