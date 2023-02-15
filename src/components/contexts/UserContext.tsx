import Character from "@/models/Character";
import { defaultEquippedItems } from "@/models/Item";
import User from "@/models/User";
import { createContext, useContext, useState } from "react";

type UserContextData = {
  user: User;
  createCharacter: (character: Character) => void;
  deleteCharacter: (character: Character) => void;
  selectCharacter: (character: Character | null) => void;
};

const UserContext = createContext<UserContextData | null>(null);

export default function UserContextProvider({ children }: React.PropsWithChildren) {
  const [user, setUser] = useState<User>({ id: 1, characters: [], gold: 0, name: 'DatBear' });

  const createCharacter = (character: Character) => {
    const char = {
      ...character,
      level: 1,
      equippedItems: defaultEquippedItems[character.class],
      inventoryItems: [...Array(8)]
    } as Character;
    setUser({ ...user, characters: user.characters.concat(char) });
  }

  const deleteCharacter = (character: Character) => {
    setUser({ ...user, characters: user.characters.filter(x => x.id !== character.id) });
  }

  const selectCharacter = (character: Character | null) => {
    setUser({ ...user, selectedCharacter: character });
  }

  return <UserContext.Provider value={{ user, createCharacter, deleteCharacter, selectCharacter }}>
    {children}
  </UserContext.Provider>
}

export function useUser() {
  let context = useContext(UserContext);
  return context!;
}