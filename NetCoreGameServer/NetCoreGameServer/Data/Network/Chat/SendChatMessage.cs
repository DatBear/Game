using MediatR;
using NetCoreGameServer.Data.Model;
using NetCoreGameServer.Websocket;

namespace NetCoreGameServer.Data.Network.Chat;


public class SendChatMessageRequest : BaseRequestPacket<ChatMessage>, IRequest
{
    public override int Type => (int)RequestPacketType.SendChatMessage;
}

public class SendChatMessageResponse : BaseResponsePacket<ChatMessage>
{
    public override int Type => (int)ResponsePacketType.SendChatMessage;
}


public class SendChatMessageHandler : IRequestHandler<SendChatMessageRequest>
{
    private readonly GameSession _session;
    private readonly GameManager _gameManager;

    public SendChatMessageHandler(GameSession session, GameManager gameManager)
    {
        _session = session;
        _gameManager = gameManager;
    }

    public async Task Handle(SendChatMessageRequest request, CancellationToken cancellationToken)
    {
        switch (request.Data.Type)
        {
            case ChatMessageType.GlobalChat:
                _gameManager.GetSession(_session.User.Id)!.SendAll(new SendChatMessageResponse()
                {
                    Data = new ChatMessage
                    {
                        From = _session.User.Username,
                        Message = request.Data.Message,
                        Type = request.Data.Type,
                        Timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()
                    }
                });
                break;
        }
    }
}