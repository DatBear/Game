import ResponsePacketType from "@/network/ResponsePacketType";
import Window from "./Window";
import { UIWindowState, useWindow } from "./contexts/UIContext";
import { listen } from "@/network/Socket";
import { useEffect, useState } from "react";
import ErrorMessage from "@/models/ErrorMessage";
import { UIWindow } from "@/models/UIWindow";

export default function ErrorWindow() {
  const { closeWindow, windowState, setWindowState } = useWindow<UIWindowState>(UIWindow.Error);
  const [error, setError] = useState<ErrorMessage>();

  useEffect(() => {
    return listen(ResponsePacketType.Error, (e: ErrorMessage) => {
      setError(e);
      setWindowState({ ...windowState!, isVisible: true });
    }, true);
  }, [windowState, error, setWindowState]);

  return <Window className="w-96 h-40 left-0 top-0" isVisible={windowState!.isVisible} close={closeWindow} coords={windowState!.coords} type={windowState!.type}>
    <Window.Title>Error</Window.Title>
    <div className="w-96 h-24 flex items-center">
      <div className="text-center h-max w-full">{error && error.message}</div>
    </div>
  </Window>
}