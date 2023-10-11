enum ResponsePacketType {
  Ping,
  Pong,
  ListCharacters,
  CreateCharacter,
  SendChatMessage,
  SelectCharacter,
  CreateGroup,
  ListGroups,
  JoinGroup,
  LeaveGroup,
  GetUser,
  SetGroupLeader,
  UpdateCharacter,
  UpdateMaze,

  Error = 255
}

export default ResponsePacketType;