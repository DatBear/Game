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
    private readonly User _user;
    private readonly SessionManager _sessionManager;

    public SendChatMessageHandler(User user, SessionManager sessionManager)
    {
        _user = user;
        _sessionManager = sessionManager;
    }

    public async Task Handle(SendChatMessageRequest request, CancellationToken cancellationToken)
    {
        switch (request.Data.Type)
        {
            case ChatMessageType.GlobalChat:
                _sessionManager.GetSession(_user.Id)!.SendAll(new SendChatMessageResponse()
                {
                    Data = new ChatMessage
                    {
                        From = _user.Username,
                        Message = request.Data.Message,
                        Type = request.Data.Type,
                        Timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()
                    }
                });
                break;
        }
    }
}