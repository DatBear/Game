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
  AttackTarget,
  ChangeZone
}

export default RequestPacketType;