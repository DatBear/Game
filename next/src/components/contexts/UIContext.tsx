import { EquippedItemSlot } from "@/models/EquippedItem";
import Item from "@/models/Item";
import MarketItem from "@/models/MarketItem";
import { SkillType } from "@/models/Skill";
import { createContext, Fragment, ReactNode, useCallback, useContext, useEffect, useState } from "react";
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
  coords: XYCoord;
  type: UIWindow;
  order: number;
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

export const saveWindowState = (type: UIWindow, state: UIWindowState) => {
  localStorage.setItem(windowLocalStorageKey(type), JSON.stringify(state));
}

let order = 0;
const defaultWindowState = (type: UIWindow) => {
  if (typeof window !== "undefined") {
    let storageItem = localStorage.getItem(windowLocalStorageKey(type));
    if (storageItem) {
      let parsed = JSON.parse(storageItem);
      parsed.order = parsed.order ?? order++;
      parsed.type = parsed.type ?? type;
      parsed.coords = parsed.coords ?? { x: 0, y: 0 };
      return parsed;
    }
  }

  return {
    type,
    isVisible: false,
    order: order++,
    coords: { x: 50, y: 50 }
  } as UIWindowState;
}

let defaultWindowStates: WindowRecord<any> = {
  [UIWindow.None]: { ...defaultWindowState(UIWindow.None) },
  [UIWindow.Inventory]: { ...defaultWindowState(UIWindow.Inventory) },
  [UIWindow.Groups]: { ...defaultWindowState(UIWindow.Groups) },
  [UIWindow.Shrine]: { ...defaultWindowState(UIWindow.Shrine) } as UIShrineWindowState,
  [UIWindow.Marketplace]: { ...defaultWindowState(UIWindow.Marketplace), searchResults: [] } as UIMarketplaceWindowState,
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

let windowComponents: Record<UIWindow, ReactNode> = {
  [UIWindow.None]: <div></div>,
  [UIWindow.Inventory]: <InventoryWindow />,
  [UIWindow.Groups]: <GroupsWindow />,
  [UIWindow.Shrine]: <ShrineWindow />,
  [UIWindow.Marketplace]: <MarketplaceWindow />,
  [UIWindow.Cooking]: <SkillingWindow skillType={SkillType.Cooking} window={UIWindow.Cooking} />,
  [UIWindow.Transmuting]: <SkillingWindow skillType={SkillType.Transmuting} window={UIWindow.Transmuting} />,
  [UIWindow.Suffusencing]: <SkillingWindow skillType={SkillType.Suffusencing} window={UIWindow.Suffusencing} />,
  [UIWindow.Fishing]: <SkillingWindow skillType={SkillType.Fishing} window={UIWindow.Fishing} />,
  [UIWindow.Glyphing]: <SkillingWindow skillType={SkillType.Glyphing} window={UIWindow.Glyphing} />,
  [UIWindow.Stats]: <StatsWindow />,
  [UIWindow.Chat]: <ChatWindow />,
  [UIWindow.GroundItems]: <GroundItemsWindow />,
  [UIWindow.Error]: <ErrorWindow />
}

const UIContext = createContext({} as UIContextProps);

export default function UIContextProvider({ children }: React.PropsWithChildren) {
  const [windowStates, setWindowStates] = useState(defaultWindowStates);
  const { user, selectCharacter } = useUser();
  const { character } = useCharacter();

  const setWindowState = (type: UIWindow, state: UIWindowState) => {
    //console.log('saving window state', UIWindow[type], state);
    saveWindowState(type, state);
    setWindowStates(x => ({
      ...x,
      [type]: { ...windowStates[type], ...state }
    }));
  };

  const toggleWindow = (type: UIWindow) => {
    const state = windowStates[type] as UIWindowState;
    setWindowState(type, { ...windowStates[type]!, isVisible: !state!.isVisible });
  }

  const goToCharacterSelect = () => {
    selectCharacter(null);
  }

  return (<UIContext.Provider value={{ setWindowState, windowStates }}>
    {!user.selectedCharacter && children}
    {user.selectedCharacter && <>
      <div className="flex flex-col gap-3 p-2 h-full">
        {character && <div className="flex flex-row">
          <div className="flex flex-row gap-2">
            <ItemSlot medium noDrag noTooltip hotkey="Q" item={character.equippedItems.find(x => x.equippedItemSlot === EquippedItemSlot.Weapon)} />
            <ItemSlot medium noDrag noTooltip hotkey="E" item={character.equippedItems.find(x => x.equippedItemSlot === EquippedItemSlot.Charm)} />
            <ItemSlot medium noDrag noTooltip hotkey="R" item={character.equippedItems.find(x => x.equippedItemSlot === EquippedItemSlot.AccCharm)} />
            <ItemSlot medium noDrag noTooltip hotkey="1" />
            <ItemSlot medium noDrag noTooltip hotkey="2" />
            <ItemSlot medium noDrag noTooltip hotkey="3" />
            <ItemSlot medium noDrag noTooltip hotkey="4" />
            <ItemSlot medium noDrag noTooltip hotkey="5" />
          </div>
          <div className="flex flex-row gap-2 pl-10">
            {character.activeGlyphs.map(x => <ItemSlot key={x.id} medium noDrag noBackground borderless item={x} />)}
          </div>
        </div>}
        <div className="flex flex-row flex-grow">
          <GroupDisplay />
          <div>
            {children}
          </div>
        </div>
        <div>
          <div className="flex justify-between">
            <div className="flex flex-row gap-1">
              <button onClick={_ => toggleWindow(UIWindow.Chat)} className="!px-2 h-8"><img src="svg/iconChat.svg" alt="chat window" className="w-6 h-6" /></button>
              <button onClick={_ => toggleWindow(UIWindow.Inventory)} className="!px-2 h-8"><img src="svg/iconInventory.svg" alt="inventory window" className="w-6 h-6" /></button>
              <button onClick={_ => toggleWindow(UIWindow.Groups)} className="!px-2 h-8"><img src="svg/iconGroup.svg" alt="groups window" className="w-6 h-6" /></button>
              <button onClick={_ => toggleWindow(UIWindow.Stats)} className="!px-2 h-8"><img src="svg/iconStats.svg" alt="stats window" className="w-6 h-6" /></button>
            </div>
            <div className="flex flex-row gap-1">
              <button onClick={_ => goToCharacterSelect()} className="!px-2 h-8"><img src="svg/iconLogOut.svg" alt="stats window" className="w-6 h-6" /></button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-row flex-wrap gap-3 p-5 absolute left-0 top-0">
        <div className="relative">
          {Object.entries(windowComponents)
            .map(e => [e[0] as unknown as UIWindow, e[1]] as [UIWindow, ReactNode])
            .sort((a, b) => windowStates[a[0]]?.order < windowStates[b[0]]?.order ? 1 : -1)
            .map((e: [UIWindow, ReactNode]) => <Fragment key={e[0]}>{(e && e[1]) ?? <></>}</Fragment>)}
        </div>
      </div>
    </>}
    {!user.selectedCharacter && <>
      <div className="flex flex-row flex-wrap gap-3 p-5 absolute left-0 top-0">
        <div className="relative">
          <ErrorWindow />
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