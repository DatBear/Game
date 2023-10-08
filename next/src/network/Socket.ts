'use client';

import RequestPacketType from "./RequestPacketType";
import ResponsePacketType from "./ResponsePacketType";

let _socket: WebSocket;
const socket = () => {
  if (!_socket) {
    _socket = new WebSocket(`ws://${location.host.indexOf(':') > 0 ? location.host.substring(0, location.host.indexOf(':')) : location.host}:4000`);
    _socket.onmessage = onMessage;
    _socket.onclose = onClose;
  }
  return _socket;
};

const onMessage = (msg: MessageEvent<any>) => {
  try {
    //console.log('received', msg.data);
    let data = JSON.parse(msg.data);
    let eventName = `ws-ev-${data.type}`;
    const event = new CustomEvent(eventName, { detail: data.data });
    document.dispatchEvent(event);
  } catch (e) {
    console.error('error sending event for data: ', msg.data);
  }
}

const onClose = (msg: CloseEvent) => {
  window.location.href = window.location.protocol + '//' + window.location.host;
}

const send = <T>(type: RequestPacketType, data: T, log: boolean = false) => {
  let s = socket();
  let str = JSON.stringify({ data, type });
  s.send(str);
  if (log) {
    console.log('sent ', RequestPacketType[type], str);
  }
}

const listen = <T>(event: ResponsePacketType, handler: (data: T) => void, log: boolean = false) => {
  const eventListener = (msg: CustomEvent<any>) => {
    if (log) {
      console.log('received ', ResponsePacketType[event], msg.detail);
    }
    handler(msg.detail as T);
  }
  const eventName = `ws-ev-${event}`;
  //@ts-ignore -- typescript doesn't like custom events
  document.addEventListener(eventName, eventListener);
  //console.log('listening for', eventName);
  //@ts-ignore -- typescript doesn't like custom events
  return () => document.removeEventListener(`ws-ev-${event}`, eventListener);
}

export default socket;
export { socket, listen, send };