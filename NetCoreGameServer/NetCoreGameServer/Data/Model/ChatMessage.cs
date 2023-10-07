namespace NetCoreGameServer.Data.Model;

public class ChatMessage
{
    public string From { get; set; }
    public string To { get; set; }
    public string Message { get; set; }
    public ChatMessageType Type { get; set; }
    public long Timestamp { get; set; } = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
}