enum RequestPacketType {
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
  EquipItem,
  UnequipItem,
  DeleteItem,
  UpdateMaze,
  MoveDirection,
}

export default RequestPacketType;