import { Cooking, Transmuting, Suffusencing, Fishing, Glyphing } from "@/models/Skill";
import { createContext, useContext } from "react";
import GroupsWindow from "../GroupsWindow";
import InventoryWindow from "../InventoryWindow";
import MarketplaceWindow from "../MarketplaceWindow";
import ShrineWindow from "../ShrineWindow";
import SkillingWindow from "../SkillingWindow";
import { useUser } from "./UserContext";

let skills = [Cooking, Transmuting, Suffusencing, Fishing, Glyphing];

type UIContextProps = {

};

const UIContext = createContext<UIContextProps | null>(null);

export default function UIContextProvider({ children }: UIContextProps & React.PropsWithChildren) {
  const { user } = useUser();
  return (<UIContext.Provider value={{}}>
    {children}
    {user.selectedCharacter && <div className="flex flex-row flex-wrap gap-3 m-5">
      <InventoryWindow />
      <GroupsWindow />
      <ShrineWindow />
      <MarketplaceWindow />
      {skills.map(x => <SkillingWindow key={x.name} skill={x} />)}
    </div>}

  </UIContext.Provider>);
}

export function useUI() {
  let context = useContext(UIContext);
  return context!;
}