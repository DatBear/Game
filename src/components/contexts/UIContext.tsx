import Item from "@/models/Item";
import MarketItem from "@/models/MarketItem";
import { Cooking, Transmuting, Suffusencing, Fishing, Glyphing } from "@/models/Skill";
import { createContext, ReactNode, useCallback, useContext, useState } from "react";
import GroupsWindow from "../GroupsWindow";
import InventoryWindow from "../InventoryWindow";
import MarketplaceWindow from "../MarketplaceWindow";
import ShrineWindow from "../ShrineWindow";
import SkillingWindow from "../SkillingWindow";
import StatsWindow from "../StatsWindow";
import { useUser } from "./UserContext";

export enum UIWindow {
  Inventory,
  Groups,
  Shrine,
  Marketplace,
  Cooking,
  Transmuting,
  Suffusencing,
  Fishing,
  Glyphing,
  Stats
}

export type UIWindowState = {
  isVisible: boolean;
}

export type UIMarketplaceWindowState = UIWindowState & {
  sellItem?: Item;
  buyItem?: MarketItem;
  transferItem?: Item;
  searchResults: MarketItem[];
}

export type UIShrineWindowState = UIWindowState & {
  shrineItem?: Item;
}

type WindowRecord<T> = Record<UIWindow, T & UIWindowState>;

type UIContextProps = {
  windowStates: WindowRecord<any>;
  setWindowState: (window: UIWindow, state: UIWindowState) => void;
};



let defaultWindowState: WindowRecord<any> = {
  [UIWindow.Inventory]: { isVisible: false },
  [UIWindow.Groups]: { isVisible: false },
  [UIWindow.Shrine]: { isVisible: false } as UIShrineWindowState,
  [UIWindow.Marketplace]: { isVisible: false, searchResults: [] } as UIMarketplaceWindowState,
  [UIWindow.Cooking]: { isVisible: false },
  [UIWindow.Transmuting]: { isVisible: false },
  [UIWindow.Suffusencing]: { isVisible: false },
  [UIWindow.Fishing]: { isVisible: false },
  [UIWindow.Glyphing]: { isVisible: false },
  [UIWindow.Stats]: { isVisible: true },
}

const UIContext = createContext({} as UIContextProps);

export default function UIContextProvider({ children }: React.PropsWithChildren) {
  const [windowStates, setWindowStates] = useState(defaultWindowState);
  const { user } = useUser();

  const setWindowState = (window: UIWindow, state: UIWindowState) => {
    setWindowStates(x => ({
      ...x,
      [window]: { ...windowStates[window], ...state }
    }));
  }

  const renderWindow = (window: UIWindow, component: ReactNode) => {
    return windowStates[window].isVisible ? component : <></>;
  }

  return (<UIContext.Provider value={{ setWindowState, windowStates }}>
    {children}
    {user.selectedCharacter &&
      <div className="flex flex-row flex-wrap gap-3 p-5 absolute left-0 top-0">
        <div className="relative">
          {renderWindow(UIWindow.Inventory, <InventoryWindow />)}
          {renderWindow(UIWindow.Groups, <GroupsWindow />)}
          {renderWindow(UIWindow.Shrine, <ShrineWindow />)}
          {renderWindow(UIWindow.Marketplace, <MarketplaceWindow />)}
          {renderWindow(UIWindow.Cooking, <SkillingWindow skill={Cooking} window={UIWindow.Cooking} />)}
          {renderWindow(UIWindow.Fishing, <SkillingWindow skill={Fishing} window={UIWindow.Fishing} />)}
          {renderWindow(UIWindow.Transmuting, <SkillingWindow skill={Transmuting} window={UIWindow.Transmuting} />)}
          {renderWindow(UIWindow.Glyphing, <SkillingWindow skill={Glyphing} window={UIWindow.Glyphing} />)}
          {renderWindow(UIWindow.Suffusencing, <SkillingWindow skill={Suffusencing} window={UIWindow.Suffusencing} />)}
          {renderWindow(UIWindow.Stats, <StatsWindow />)}
        </div>
      </div>
    }
  </UIContext.Provider>);
}

export function useUI() {
  const context = useContext(UIContext);
  return context!;
}

export function useWindow<T>(window: UIWindow) {
  const { setWindowState: setWindowsState, windowStates } = useUI();
  const setWindowState = (state: UIWindowState & T) => {
    setWindowsState(window, state)
  }

  const closeWindow = useCallback(() => {
    setWindowState({ ...windowState, isVisible: false } as UIWindowState & T);
  }, [setWindowState, windowStates]);


  const windowState = windowStates ? windowStates[window] as T : null;
  return {
    setWindowState, closeWindow, windowState
  }
}