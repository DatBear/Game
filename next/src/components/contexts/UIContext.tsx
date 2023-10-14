import { EquippedItemSlot } from "@/models/EquippedItem";
import Item from "@/models/Item";
import MarketItem from "@/models/MarketItem";
import { SkillType } from "@/models/Skill";
import { createContext, ReactNode, useCallback, useContext, useState } from "react";
import GroupsWindow from "../GroupsWindow";
import InventoryWindow from "../InventoryWindow";
import ItemSlot from "../ItemSlot";
import MarketplaceWindow from "../MarketplaceWindow";
import ShrineWindow from "../ShrineWindow";
import SkillingWindow from "../SkillingWindow";
import StatsWindow from "../StatsWindow";
import { useCharacter, useUser } from "./UserContext";
import ChatWindow from "../ChatWindow";
import ErrorWindow from "../ErrorWindow";
import GroupDisplay from "../GroupDisplay";
import GroundItemsWindow from "../GroundItemsWindow";
import { UIWindow } from "@/models/UIWindow";
import { XYCoord } from "react-dnd";

export type UIWindowState = {
  isVisible: boolean;
  coords?: XYCoord;
  type: UIWindow;
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

export const windowLocalStorageKey = (window: UIWindow) => {
  return "windowState:" + UIWindow[window];
}

const defaultWindowState = (type: UIWindow) => {
  if (typeof window !== "undefined") {
    let storageItem = localStorage.getItem(windowLocalStorageKey(type));
    if (storageItem) {
      let parsed = JSON.parse(storageItem);
      return parsed;
    }
  }

  return {
    type,
    isVisible: false
  } as UIWindowState;
}

let defaultWindowStates: WindowRecord<any> = {
  [UIWindow.None]: { ...defaultWindowState(UIWindow.None) },
  [UIWindow.Inventory]: { ...defaultWindowState(UIWindow.Inventory) },
  [UIWindow.Groups]: { ...defaultWindowState(UIWindow.Groups) },
  [UIWindow.Shrine]: { ...defaultWindowState(UIWindow.Shrine) } as UIShrineWindowState,
  [UIWindow.Marketplace]: { ...defaultWindowState(UIWindow.Marketplace), searchResults: [], type: UIWindow.Marketplace } as UIMarketplaceWindowState,
  [UIWindow.Fishing]: { ...defaultWindowState(UIWindow.Fishing), items: Array(1) } as UISkillWindowState,
  [UIWindow.Cooking]: { ...defaultWindowState(UIWindow.Cooking), items: Array(1) } as UISkillWindowState,
  [UIWindow.Transmuting]: { ...defaultWindowState(UIWindow.Transmuting), items: Array(2) } as UISkillWindowState,
  [UIWindow.Suffusencing]: { ...defaultWindowState(UIWindow.Suffusencing), items: Array(2) } as UISkillWindowState,
  [UIWindow.Glyphing]: { ...defaultWindowState(UIWindow.Glyphing), items: Array(2) } as UISkillWindowState,
  [UIWindow.Chat]: { ...defaultWindowState(UIWindow.Chat) },
  [UIWindow.GroundItems]: { ...defaultWindowState(UIWindow.GroundItems) },
  [UIWindow.Stats]: { ...defaultWindowState(UIWindow.Stats) },
  [UIWindow.Error]: { ...defaultWindowState(UIWindow.Error) }
}

const UIContext = createContext({} as UIContextProps);

export default function UIContextProvider({ children }: React.PropsWithChildren) {
  const [windowStates, setWindowStates] = useState(defaultWindowStates);
  const { user } = useUser();
  const { character } = useCharacter();


  const setWindowState = (window: UIWindow, state: UIWindowState) => {
    setWindowStates(x => ({
      ...x,
      [window]: { ...windowStates[window], ...state }
    }));
  }

  const renderWindow = (window: UIWindow, component: ReactNode) => {
    return component;
  }

  return (<UIContext.Provider value={{ setWindowState, windowStates }}>
    {!user.selectedCharacter && children}
    {user.selectedCharacter && <>
      <div className="flex flex-col gap-3 p-2">
        {character && <div className="flex flex-row gap-2">
          <ItemSlot medium noDrag noTooltip hotkey="Q" item={character.equippedItems.find(x => x.equippedItemSlot === EquippedItemSlot.Weapon)} />
          <ItemSlot medium noDrag noTooltip hotkey="E" item={character.equippedItems.find(x => x.equippedItemSlot === EquippedItemSlot.Charm)} />
          <ItemSlot medium noDrag noTooltip hotkey="R" item={character.equippedItems.find(x => x.equippedItemSlot === EquippedItemSlot.AccCharm)} />
          <ItemSlot medium noDrag noTooltip hotkey="1" />
          <ItemSlot medium noDrag noTooltip hotkey="2" />
          <ItemSlot medium noDrag noTooltip hotkey="3" />
          <ItemSlot medium noDrag noTooltip hotkey="4" />
          <ItemSlot medium noDrag noTooltip hotkey="5" />
        </div>}
        <div className="flex flex-row">
          <GroupDisplay />
          <div>
            {children}
          </div>
        </div>
      </div>

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
          {renderWindow(UIWindow.Chat, <ChatWindow />)}
          {renderWindow(UIWindow.GroundItems, <GroundItemsWindow />)}
          {renderWindow(UIWindow.Stats, <StatsWindow />)}
          {renderWindow(UIWindow.Error, <ErrorWindow />)}
        </div>
      </div>
    </>}
    {!user.selectedCharacter && <>
      <div className="flex flex-row flex-wrap gap-3 p-5 absolute left-0 top-0">
        <div className="relative">
          {renderWindow(UIWindow.Error, <ErrorWindow />)}
        </div>
      </div>
    </>}
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
    setWindowsState(window, state);
  }, [setWindowsState, window]);

  const closeWindow = useCallback(() => {
    let newState = { ...windowState, isVisible: false } as UIWindowState & T;
    setWindowState(newState);
    localStorage.setItem(windowLocalStorageKey(newState.type), JSON.stringify(newState));
  }, [setWindowState, windowState]);

  return {
    setWindowState, closeWindow, windowState
  }
}