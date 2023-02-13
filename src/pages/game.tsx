import GroupsWindow from "@/components/GroupsWindow";
import InventoryWindow from '@/components/InventoryWindow'
import MarketplaceWindow from "@/components/MarketplaceWindow";
import ShrineWindow from "@/components/ShrineWindow";
import SkillingWindow from "@/components/SkillingWindow";
import Window from '@/components/Window';
import gs from '@/styles/game.module.css'
import { useEffect } from 'react';
import { Cooking, Fishing, Glyphing, Suffusencing, Transmuting } from '@/models/Skill';
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

let skills = [Cooking, Transmuting, Suffusencing, Fishing, Glyphing];

export default function Game() {
  return (<div className={gs.gameContainer}>
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-row flex-wrap gap-3 m-5">
        <InventoryWindow />
        <GroupsWindow />
        <ShrineWindow />
        <MarketplaceWindow />
        {skills.map(x => <SkillingWindow key={x.name} skill={x} />)}
      </div>
    </DndProvider>
  </div>);
}