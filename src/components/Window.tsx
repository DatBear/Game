import gs from "@/styles/game.module.css"
import clsx from "clsx";
import { Tab } from "@headlessui/react";
import { ButtonHTMLAttributes, createContext, MutableRefObject, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import WindowDataContextProvider, { useWindowData } from "./contexts/WindowDataContext";

type WindowProps = React.PropsWithChildren & {
  className?: string;
  tabbed?: boolean;
};

type _Data = ReturnType<typeof useWindowData>;

export default function Window({ children, className, tabbed }: WindowProps) {
  tabbed = tabbed ?? false;

  const [show, setShow] = useState(true);

  const handleClose = useCallback(() => {
    setShow(false);
  }, [setShow]);

  let windowData = useMemo<_Data>(() => {
    return { closeWindow: handleClose, tabbed: tabbed ?? false };
  }, [tabbed, handleClose]);

  const tabbedChildren = (() => {
    return tabbed ? <Tab.Group>{children}</Tab.Group> : children;
  })()

  return <WindowDataContextProvider {...windowData}>
    {show && <div className={clsx(gs.window, className, "bg-stone-800 p-3 text-red-50 border w-fit h-min")}>
      {tabbedChildren}
    </div>}
  </WindowDataContextProvider>
};

Window.TabList = function ({ children }: React.PropsWithChildren) {
  return <div className="flex flex-grow place-content-center px-3">
    <Tab.List className="flex flex-row gap-x-2">
      {children}
    </Tab.List>
  </div>
}

Window.Tab = function ({ children, className, ...props }: React.PropsWithChildren & Partial<React.HTMLAttributes<HTMLButtonElement>>) {
  return <Tab className={clsx(className, "ui-selected:bg-stone-700 ui-not-selected:bg-stone-800 outline outline-1 px-2 py-1")} {...props}>{children}</Tab>
}

Window.TabPanels = function ({ children }: React.PropsWithChildren) {
  return <Tab.Panels>{children}</Tab.Panels>
}

Window.TabPanel = function ({ children }: React.PropsWithChildren) {
  return <Tab.Panel>{children}</Tab.Panel>
}

type WindowTitleProps = {
  closeButton?: boolean;
  dragHandle?: boolean;
} & Partial<React.HTMLAttributes<HTMLDivElement>>;

Window.Title = function ({ closeButton, dragHandle, children, className, ...props }: WindowTitleProps) {
  const { tabbed } = useWindowData('Title');

  let childrenOrTabbedChildren = (function () {
    return tabbed ? children : <div className="flex-grow text-center">{children}</div>
  })();

  return <div className={clsx(className, "flex flex-row items-start pb-2 px-2")} {...props}>
    {(dragHandle ?? true) && <DragHandle />}
    {childrenOrTabbedChildren}
    {(closeButton ?? true) && <CloseButton />}
  </div>
}

let CloseButton = function () {
  const { closeWindow } = useWindowData('CloseButton');
  return (<button onClick={() => closeWindow()} className="flex-none w-4 h-4"><img src="svg/iconClose.svg" /></button>);
};

let DragHandle = function () {
  return (<button className="flex-none w-4 h-4"><img src="svg/dragHandle.svg" /></button>)
}