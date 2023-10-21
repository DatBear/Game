import gs from "@/styles/game.module.css"
import clsx from "clsx";
import { Tab } from "@headlessui/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import WindowDataContextProvider, { useWindowData } from "./contexts/WindowDataContext";
import { DragSourceMonitor, useDrag, XYCoord } from "react-dnd";
import { UIWindow } from "@/models/UIWindow";
import { useUI } from "./contexts/UIContext";

type WindowProps = {
  isVisible: boolean;
  coords?: XYCoord;
  className?: string;
  tabbed?: boolean;
  type: UIWindow;
  close?: () => void;
} & React.PropsWithChildren
  & Partial<React.HTMLAttributes<HTMLDivElement>>;

type _Data = ReturnType<typeof useWindowData>;

let type = "Window";

export default function Window({ children, isVisible, coords, className, tabbed, type, close, ...props }: WindowProps) {
  tabbed = tabbed ?? false;

  const windowRef = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(isVisible);
  const { setWindowState, windowStates } = useUI();

  useEffect(() => {
    setShow(isVisible);
  }, [isVisible]);

  const handleClose = useCallback(() => {
    if (close) {
      close();
      return;
    }
    setShow(false);
  }, [setShow, close]);

  const onDragEnd = (monitor: DragSourceMonitor<unknown, unknown>) => {
    if (windowRef.current !== null && monitor !== null) {
      let prevCoords = windowStates[type]?.coords ?? { x: 0, y: 0 } as XYCoord;
      //console.log('prev coords', UIWindow[type], prevCoords, windowStates[type]?.coords, windowStates[type]?.coords);
      prevCoords.x += monitor.getClientOffset()?.x! - monitor.getInitialClientOffset()?.x!;
      prevCoords.y += monitor.getClientOffset()?.y! - monitor.getInitialClientOffset()?.y!;
      prevCoords.x = Math.max(0, prevCoords.x);
      prevCoords.y = Math.max(0, prevCoords.y);
      //console.log('new coords', prevCoords);
      if (type === undefined) return;
      let newState = { ...windowStates[type]!, coords: prevCoords };
      setWindowState(type, newState);
    }
  };

  const onClick = (e: React.MouseEvent<HTMLElement>) => {
    let el = (e.target as HTMLElement);
    if (el.classList.contains("close-window") || el.classList.contains("ignore-reorder") || el.parentElement?.classList.contains("ignore-reorder")) {
      return;
    }
    let types = Object.values(UIWindow).filter((v) => !isNaN(Number(v))).map(x => x as UIWindow);
    let oldOrder = windowStates[type]!.order;
    for (let winType of types) {
      let state = windowStates[winType];
      if (state.order < oldOrder) {
        let newState = { ...state, order: ++state.order };
        setWindowState(winType, newState);
      }
    }

    let newState = { ...windowStates[type]!, order: 0 };
    setWindowState(type, newState);
  }

  const tabbedChildren = (() => {
    return tabbed ? <Tab.Group>{children}</Tab.Group> : children;
  })()

  let windowData = useMemo<_Data>(() => {
    return { closeWindow: handleClose, tabbed: tabbed ?? false, windowRef, onDragEnd };
  }, [windowRef.current, onDragEnd, tabbed, handleClose, windowStates, windowStates[type], windowStates[type].coords]);

  let positionStyle = windowStates[type]!.coords ? { ...props.style, left: windowStates[type]!.coords.x - 30, top: windowStates[type]!.coords.y - 30 } : props.style
  return <WindowDataContextProvider {...windowData}>
    {show && <div ref={windowRef} style={positionStyle} className={clsx(gs.window, className, "bg-stone-800 p-3 text-red-50 border w-fit h-min", "absolute")} onClick={e => onClick(e)}>
      {tabbedChildren}
    </div>}
  </WindowDataContextProvider>
};

const WindowTabList = function ({ children }: React.PropsWithChildren) {
  return (<div className="flex flex-grow place-content-center px-3">
    <Tab.List className="flex flex-row gap-x-2 sm:w-max">
      {children}
    </Tab.List>
  </div>)
}
Window.TabList = WindowTabList;

const WindowTab = function ({ children, className, ...props }: React.PropsWithChildren & Partial<React.HTMLAttributes<HTMLButtonElement>>) {
  return <Tab className={clsx(className, "ui-selected:bg-stone-700 ui-not-selected:bg-stone-800 outline outline-1 px-2 py-1")} {...props}>{children}</Tab>
}
Window.Tab = WindowTab;

const WindowTabPanels = function ({ children }: React.PropsWithChildren) {
  return <Tab.Panels>{children}</Tab.Panels>
}
Window.TabPanels = WindowTabPanels;

const WindowTabPanel = function ({ children }: React.PropsWithChildren) {
  return <Tab.Panel>{children}</Tab.Panel>
}
Window.TabPanel = WindowTabPanel;

type WindowTitleProps = {
  closeButton?: boolean;
  dragHandle?: boolean;
} & Partial<React.HTMLAttributes<HTMLDivElement>>;

const Title = function ({ closeButton, dragHandle, children, className, ...props }: WindowTitleProps) {
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
Window.Title = Title;

const CloseButton = function () {
  const { closeWindow } = useWindowData('CloseButton');
  return (<div onClick={() => { closeWindow() }} className="flex-none w-4 h-4 cursor-pointer close-window"><img src="svg/iconClose.svg" alt="close" /></div>);
};

const DragHandle = function () {
  const dragRef = useRef(null);
  const { windowRef, onDragEnd } = useWindowData('DragHandle');

  const [{ }, drag, preview] = useDrag(() => ({
    type: type,
    collect: (monitor) => ({}),
    end(draggedItem, monitor) {
      onDragEnd(monitor);
    }
  }));

  preview(windowRef);
  drag(dragRef);

  return (<div ref={dragRef} className="flex-none w-4 h-4 cursor-grab"><img src="svg/dragHandle.svg" alt="drag handle" /></div>)
}