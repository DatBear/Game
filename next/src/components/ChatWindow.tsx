import { useState, KeyboardEvent, useEffect, useCallback, useRef, LegacyRef } from "react";
import Window from "./Window";
import { UIChatWindowState, UIWindow, useWindow } from "./contexts/UIContext";
import { listen, send } from "@/network/Socket";
import RequestPacketType from "@/network/RequestPacketType";
import ChatMessage, { ChatMessageType } from "@/models/ChatMessage";
import ResponsePacketType from "@/network/ResponsePacketType";

export default function ChatWindow() {
  const { closeWindow, windowState, setWindowState } = useWindow<UIChatWindowState>(UIWindow.Chat);
  const [message, setMessage] = useState('');

  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView();
    return listen(ResponsePacketType.SendChatMessage, (e: ChatMessage) => {
      setWindowState({ ...windowState!, messages: [...windowState?.messages!, e] });
    });
  }, [windowState]);

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      send(RequestPacketType.SendChatMessage, { message, type: ChatMessageType.GlobalChat } as ChatMessage);
      setMessage('');
    }
  }

  return <Window className="" close={() => closeWindow()}>
    <Window.Title>Chat</Window.Title>
    <div className="flex flex-col gap-y-1 h-60 w-96 border border-white overflow-y-scroll wrap">
      <div className="flex-grow"></div>
      {windowState?.messages.map(x => {
        var message = x.from ? `${x.from}: ${x.message}` : x.to ? `To ${x.to}: ${x.message}` : x.message;
        return <div key={x.timestamp + x.from} className="px-2">
          {message}
        </div>
      })}
      <div ref={scrollRef}></div>
    </div>
    <input className="align-bottom self-end items-end" value={message} onChange={e => setMessage(e.target.value)} onKeyDown={e => onKeyDown(e)} />
  </Window>
}