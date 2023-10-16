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
  AttackTarget,
  AddGroundItem,
  UpdateGroundItem,
  StartSkill,
  UpdateSkill,

  Error = 255
}

export default ResponsePacketType;