import { createContext, useContext } from "react";

interface StateDefinition {
  tabbed: boolean;
  closeWindow: () => void;
}

const WindowDataContext = createContext<StateDefinition | null>(null);

export default function WindowDataContextProvider({ tabbed, closeWindow, children }: StateDefinition & React.PropsWithChildren) {
  return (<WindowDataContext.Provider value={{ tabbed, closeWindow }}>
    {children}
  </WindowDataContext.Provider>);
}

export function useWindowData(component: string) {
  let context = useContext(WindowDataContext);
  if (context === null) {
    //return context!;//todo remove this? hot reload triggers the error all the time :(
    let err = new Error(`<${component} /> is missing a parent <Window /> component.`)
    if (Error.captureStackTrace) Error.captureStackTrace(err, useWindowData)
    throw err
  }
  return context;
}

