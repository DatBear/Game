import GroupsWindow from "@/components/GroupsWindow";
import InventoryWindow from '@/components/InventoryWindow'
import MarketplaceWindow from "@/components/MarketplaceWindow";
import ShrineWindow from "@/components/ShrineWindow";
import SkillingWindow from "@/components/SkillingWindow";
import Window from '@/components/Window';
import gs from '@/styles/game.module.css'
import { useEffect } from 'react';
import { Cooking, Fishing, Glyphing, Suffusencing, Transmuting } from '@/models/Skill';

let skills = [Cooking, Transmuting, Suffusencing, Fishing, Glyphing];

export default function Game() {
  return (<div className={gs.gameContainer}>
    <div className="flex flex-row flex-wrap gap-3 m-5">
      {skills.map(x => <SkillingWindow key={x.name} skill={x} />)}
      <GroupsWindow />
      <ShrineWindow />
      <MarketplaceWindow />
      <InventoryWindow />
    </div>


  </div>);
}