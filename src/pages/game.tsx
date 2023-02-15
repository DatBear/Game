import gs from '@/styles/game.module.css'
import UIContextProvider from "@/components/contexts/UIContext";
import UserContextProvider from "@/components/contexts/UserContext";
import CharacterSelect from "@/components/scenes/CharacterSelect";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import Town from "@/components/scenes/Town";

export default function Game() {
  return (<DndProvider backend={HTML5Backend}>
    <div className={gs.gameContainer}>
      <UserContextProvider>
        <CharacterSelect />
        <UIContextProvider>
          <Town />
        </UIContextProvider>
      </UserContextProvider>
    </div>
  </DndProvider>);
};