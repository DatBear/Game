'use client';

import RequestPacketType from "./RequestPacketType";
import ResponsePacketType from "./ResponsePacketType";

let _socket: WebSocket;
const socket = () => {
  if (!_socket) {
    _socket = new WebSocket('ws://localhost:4000');
    _socket.onmessage = onMessage;
  }
  return _socket;
};

const onMessage = (msg: MessageEvent<any>) => {
  try {
    //console.log(msg);
    let data = JSON.parse(msg.data);
    let eventName = `ws-ev-${data.type}`;
    //console.log('sending event ', eventName, data.data);
    const event = new CustomEvent(eventName, { detail: data.data });
    document.dispatchEvent(event);
  } catch (e) {
    console.error('error sending event for data: ', msg.data);
  }
}

const send = <T>(event: RequestPacketType, data: T) => {
  let s = socket();
  s.send(JSON.stringify({ ...data, type: event }));
}

const listen = <T>(event: ResponsePacketType, handler: (data: T) => void) => {
  const eventListener = (msg: CustomEvent<any>) => {
    //console.log('received msg', msg.detail);
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