enum ChatMessageType {
  GlobalChat,
  GroupChat,
  PrivateChat,
  SystemMessage
}

export type ChatMessage = {
  from: string;
  to: string;
  message: string;
  type: ChatMessageType;
  timestamp: number;
};

export default ChatMessage;
export { ChatMessageType };