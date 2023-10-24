namespace NetCoreGameServer.Data.Network;

public enum ResponsePacketType
{
    Ping = 0,
    Pong = 1,
    ListCharacters = 2,
    CreateCharacter = 3,
    SendChatMessage = 4,
    SelectCharacter = 5,
    CreateGroup = 6,
    ListGroups = 7,
    JoinGroup = 8,
    LeaveGroup = 9,
    GetUser = 10,
    SetGroupLeader = 11,
    UpdateCharacter = 12,
    UpdateMaze = 13,
    AttackTarget = 14,
    AddGroundItem = 15,
    UpdateGroundItem = 16,
    StartSkill = 17,
    UpdateSkill = 18,
    SellItem = 19,
    SearchMarketItems = 20,
    BuyItem = 21,
    UpdateMarketItem = 22,
    CancelMarketItem = 23,
    TransferItem = 24,

    Error = 255,
}