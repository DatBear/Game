import { EquippedItemSlot } from "@/models/EquippedItem";
import Item from "@/models/Item";
import MarketItem from "@/models/MarketItem";
import { Cooking, Transmuting, Suffusencing, Fishing, Glyphing, SkillType } from "@/models/Skill";
import { CharacterStats } from "@/models/Stats";
import { createContext, createRef, ReactNode, useCallback, useContext, useState } from "react";
import CharacterImage from "../CharacterImage";
import GroupsWindow from "../GroupsWindow";
import InventoryWindow from "../InventoryWindow";
import ItemSlot from "../ItemSlot";
import MarketplaceWindow from "../MarketplaceWindow";
import ProgressBar from "../ProgressBar";
import ShrineWindow from "../ShrineWindow";
import SkillingWindow from "../SkillingWindow";
import StatsWindow from "../StatsWindow";
import { useCharacter, useUser } from "./UserContext";
import ChatMessage from "@/models/ChatMessage";
import ChatWindow from "../ChatWindow";
import ErrorWindow from "../ErrorWindow";
import GroupDisplay from "../GroupDisplay";

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
  Stats,
  Chat,
  Error
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

export type UIChatWindowState = UIWindowState & {
  messages: ChatMessage[];
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
  [UIWindow.Fishing]: { isVisible: false, items: Array(1) } as UISkillWindowState,
  [UIWindow.Cooking]: { isVisible: false, items: Array(1) } as UISkillWindowState,
  [UIWindow.Transmuting]: { isVisible: false, items: Array(2) } as UISkillWindowState,
  [UIWindow.Suffusencing]: { isVisible: false, items: Array(2) } as UISkillWindowState,
  [UIWindow.Glyphing]: { isVisible: false, items: Array(2) } as UISkillWindowState,
  [UIWindow.Chat]: { isVisible: false, messages: [] } as UIChatWindowState,
  [UIWindow.Stats]: { isVisible: false },
  [UIWindow.Error]: { isVisible: false }
}

const UIContext = createContext({} as UIContextProps);

export default function UIContextProvider({ children }: React.PropsWithChildren) {
  const [windowStates, setWindowStates] = useState(defaultWindowState);
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
          <ItemSlot medium noDrag noTooltip hotkey="Q" item={character.equippedItems.find(x => x.slot === EquippedItemSlot.Weapon)?.item} />
          <ItemSlot medium noDrag noTooltip hotkey="E" item={character.equippedItems.find(x => x.slot === EquippedItemSlot.Charm)?.item} />
          <ItemSlot medium noDrag noTooltip hotkey="R" item={character.equippedItems.find(x => x.slot === EquippedItemSlot.AccCharm)?.item} />
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
    setWindowState({ ...windowState, isVisible: false } as UIWindowState & T);
  }, [setWindowState, windowState]);

  return {
    setWindowState, closeWindow, windowState
  }
}