namespace NetCoreGameServer.Data.Network;

public enum RequestPacketType
{
    Ping = 0,
    Pong = 1,
    ListCharacters = 2,
    CreateCharacter = 3,
    SendChatMessage = 4,
    SelectCharacter = 5,
}