import Item from "@/models/Item";
import MarketItem from "@/models/MarketItem";
import { Cooking, Transmuting, Suffusencing, Fishing, Glyphing, SkillType } from "@/models/Skill";
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

export type UISkillWindowState = UIWindowState & {
  items: Item[];
}

type WindowRecord<T> = Record<UIWindow, T & UIWindowState>;

type UIContextProps = {
  windowStates: WindowRecord<any>;
  setWindowState: (window: UIWindow, state: UIWindowState) => void;
};



let defaultWindowState: WindowRecord<any> = {
  [UIWindow.Inventory]: { isVisible: true },
  [UIWindow.Groups]: { isVisible: false },
  [UIWindow.Shrine]: { isVisible: false } as UIShrineWindowState,
  [UIWindow.Marketplace]: { isVisible: false, searchResults: [] } as UIMarketplaceWindowState,
  [UIWindow.Fishing]: { isVisible: false, items: Array(1) } as UISkillWindowState,
  [UIWindow.Cooking]: { isVisible: false, items: Array(1) } as UISkillWindowState,
  [UIWindow.Transmuting]: { isVisible: false, items: Array(2) } as UISkillWindowState,
  [UIWindow.Suffusencing]: { isVisible: false, items: Array(2) } as UISkillWindowState,
  [UIWindow.Glyphing]: { isVisible: false, items: Array(2) } as UISkillWindowState,
  [UIWindow.Stats]: { isVisible: false },
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
          {renderWindow(UIWindow.Cooking, <SkillingWindow skillType={SkillType.Cooking} window={UIWindow.Cooking} />)}
          {renderWindow(UIWindow.Fishing, <SkillingWindow skillType={SkillType.Fishing} window={UIWindow.Fishing} />)}
          {renderWindow(UIWindow.Transmuting, <SkillingWindow skillType={SkillType.Transmuting} window={UIWindow.Transmuting} />)}
          {renderWindow(UIWindow.Glyphing, <SkillingWindow skillType={SkillType.Glyphing} window={UIWindow.Glyphing} />)}
          {renderWindow(UIWindow.Suffusencing, <SkillingWindow skillType={SkillType.Suffusencing} window={UIWindow.Suffusencing} />)}
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
  const windowState = windowStates ? windowStates[window] as T : null;

  const setWindowState = useCallback((state: UIWindowState & T) => {
    setWindowsState(window, state)
  }, [setWindowsState, window]);

  const closeWindow = useCallback(() => {
    setWindowState({ ...windowState, isVisible: false } as UIWindowState & T);
  }, [setWindowState, windowState]);

  return {
    setWindowState, closeWindow, windowState
  }
}