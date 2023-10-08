enum ResponsePacketType {
  Ping,
  Pong,
  ListCharacters,
  CreateCharacter,
  SendChatMessage,
  SelectCharacter,

  Error = 255
}

export default ResponsePacketType;