import { createContext, MutableRefObject, RefObject, useContext } from "react";
import { XYCoord } from "react-dnd";

interface WindowDataContextProps {
  tabbed: boolean;
  closeWindow: () => void;
  windowRef: RefObject<HTMLDivElement>,
  onDragEnd: (coords: XYCoord | null) => void;
}

const WindowDataContext = createContext<WindowDataContextProps | null>(null);

export default function WindowDataContextProvider({ tabbed, closeWindow, windowRef, onDragEnd, children }: WindowDataContextProps & React.PropsWithChildren) {
  return (<WindowDataContext.Provider value={{ tabbed, closeWindow, windowRef, onDragEnd }}>
    {children}
  </WindowDataContext.Provider>);
}

export function useWindowData(component: string) {
  let context = useContext(WindowDataContext);
  if (context === null) {
    let err = new Error(`<${component} /> is missing a parent <Window /> component.`)
    if (Error.captureStackTrace) Error.captureStackTrace(err, useWindowData)
    throw err
  }
  return context;
}

