import { Cooking, Transmuting, Suffusencing, Fishing, Glyphing } from "@/models/Skill";
import { createContext, ReactNode, useCallback, useContext, useState } from "react";
import GroupsWindow from "../GroupsWindow";
import InventoryWindow from "../InventoryWindow";
import MarketplaceWindow from "../MarketplaceWindow";
import ShrineWindow from "../ShrineWindow";
import SkillingWindow from "../SkillingWindow";
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
  Glyphing
}

export type UIWindowState = {
  isVisible: boolean;
}

type UIContextProps = {
  windowStates: Record<UIWindow, UIWindowState>;
  setWindowState: (window: UIWindow, state: UIWindowState) => void;
};

let defaultWindowState: Record<UIWindow, UIWindowState> = {
  [UIWindow.Inventory]: { isVisible: true },
  [UIWindow.Groups]: { isVisible: false },
  [UIWindow.Shrine]: { isVisible: false },
  [UIWindow.Marketplace]: { isVisible: false },
  [UIWindow.Cooking]: { isVisible: false },
  [UIWindow.Transmuting]: { isVisible: false },
  [UIWindow.Suffusencing]: { isVisible: false },
  [UIWindow.Fishing]: { isVisible: false },
  [UIWindow.Glyphing]: { isVisible: false }
}

const UIContext = createContext({} as UIContextProps);

export default function UIContextProvider({ children }: React.PropsWithChildren) {
  const [windowStates, setWindowStates] = useState(defaultWindowState);
  const { user } = useUser();

  const setWindowState = (window: UIWindow, state: UIWindowState) => {
    setWindowStates(x => ({ ...x, [window]: state }));
  }

  const renderWindow = (window: UIWindow, component: ReactNode) => {
    return windowStates[window].isVisible ? component : <></>;
  }

  return (<UIContext.Provider value={{ setWindowState, windowStates }}>
    {children}
    {user.selectedCharacter && <div className="flex flex-row flex-wrap gap-3 p-5">
      {renderWindow(UIWindow.Inventory, <InventoryWindow />)}
      {renderWindow(UIWindow.Groups, <GroupsWindow />)}
      {renderWindow(UIWindow.Shrine, <ShrineWindow />)}
      {renderWindow(UIWindow.Marketplace, <MarketplaceWindow />)}
      {renderWindow(UIWindow.Cooking, <SkillingWindow skill={Cooking} window={UIWindow.Cooking} />)}
      {renderWindow(UIWindow.Fishing, <SkillingWindow skill={Fishing} window={UIWindow.Fishing} />)}
      {renderWindow(UIWindow.Transmuting, <SkillingWindow skill={Transmuting} window={UIWindow.Transmuting} />)}
      {renderWindow(UIWindow.Glyphing, <SkillingWindow skill={Glyphing} window={UIWindow.Glyphing} />)}
      {renderWindow(UIWindow.Suffusencing, <SkillingWindow skill={Suffusencing} window={UIWindow.Suffusencing} />)}
    </div>}

  </UIContext.Provider>);
}

export function useUI() {
  const context = useContext(UIContext);
  return context!;
}

export function useWindow(window: UIWindow) {
  const { setWindowState: setWindowsState, windowStates } = useUI();
  const setWindowState = (state: UIWindowState) => {
    setWindowsState(window, state)
  }

  const closeWindow = useCallback(() => {
    setWindowState({ isVisible: false });
  }, [setWindowState, windowStates]);

  return {
    setWindowState, closeWindow
  }
}