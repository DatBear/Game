import { useState, KeyboardEvent, useEffect, useRef } from "react";
import Window from "./Window";
import { UIWindow, UIWindowState, useWindow } from "./contexts/UIContext";
import { listen, send } from "@/network/Socket";
import RequestPacketType from "@/network/RequestPacketType";
import ChatMessage, { ChatMessageType } from "@/models/ChatMessage";
import ResponsePacketType from "@/network/ResponsePacketType";
import User from "@/models/User";
import { useUser } from "./contexts/UserContext";
import GroupUser from "@/models/GroupUser";
import Group from "@/models/Group";

export default function ChatWindow() {
  const { user } = useUser();
  const { closeWindow, windowState, setWindowState } = useWindow<UIWindowState>(UIWindow.Chat);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView();
    return listen(ResponsePacketType.SendChatMessage, (e: ChatMessage) => {
      setMessages([...messages, e]);
    });
  }, [windowState, setWindowState]);

  useEffect(() => {
    return listen(ResponsePacketType.LeaveGroup, (e: User) => {
      var msg = {
        message: e.id === user.id ? 'You have left the group.' : `${e.selectedCharacter?.name} has left the group.`,
        timestamp: Date.now()
      } as ChatMessage;

      setMessages([...messages, msg]);
    });
  }, [windowState, setWindowState, user.id]);

  useEffect(() => {
    return listen(ResponsePacketType.JoinGroup, (e: GroupUser) => {
      var msg = {
        message: e.user.id === user.id ? 'You have joined a group.' : `${e.user.selectedCharacter?.name} has joined the group.`,
        timestamp: Date.now()
      } as ChatMessage;

      setMessages([...messages, msg]);
    });
  }, [windowState, setWindowState, user.id]);

  useEffect(() => {
    return listen(ResponsePacketType.CreateGroup, (e: Group) => {
      var msg = {
        message: e.leaderId === user.id ? 'Your group has been created.' : 'You have joined a group.',
        timestamp: Date.now()
      } as ChatMessage;

      setMessages([...messages, msg]);
    });
  }, [windowState, setWindowState, user.id]);



  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      send(RequestPacketType.SendChatMessage, { message, type: ChatMessageType.GlobalChat } as ChatMessage);
      setMessage('');
    }
  }

  return <Window className="" isVisible={windowState!.isVisible} close={() => closeWindow()}>
    <Window.Title>Chat</Window.Title>
    <div className="flex flex-col gap-y-1 h-60 w-96 border border-white overflow-y-scroll wrap">
      <div className="flex-grow"></div>
      {messages.map(x => {
        var message = x.from ? `${x.from}: ${x.message}` : x.to ? `To ${x.to}: ${x.message}` : x.message;
        return <div key={`${x.timestamp}${x.from}`} className="px-2">
          {message}
        </div>
      })}
      <div ref={scrollRef}></div>
    </div>
    <input className="align-bottom self-end items-end focus:border-white" value={message} onChange={e => setMessage(e.target.value)} onKeyDown={e => onKeyDown(e)} />
  </Window>
}