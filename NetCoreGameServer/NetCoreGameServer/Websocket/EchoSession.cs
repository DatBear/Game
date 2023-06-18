using System.Net;
using System.Net.Sockets;
using System.Text;
using NetCoreGameServer.Data.Model;
using NetCoreGameServer.Data.Network;
using NetCoreGameServer.Extension;
using NetCoreGameServer.Helper;
using NetCoreGameServer.Service;
using NetCoreServer;
using Newtonsoft.Json;

namespace NetCoreGameServer.Websocket;

class EchoSession : WsSession
{
    private WsServer _wsServer => (WsServer)Server;

    private readonly NextAuthHelper _nextAuthHelper;
    private readonly UserService _userService;

    private User _user;

    public EchoSession(WsServer server, NextAuthHelper nextAuthHelper, UserService userService) : base(server)
    {
        _nextAuthHelper = nextAuthHelper;
        _userService = userService;
    }

    private void CloseUnauthorized()
    {
        Close((int)HttpStatusCode.Unauthorized);
    }

    private User? GetUser(HttpRequest request)
    {
        try
        {
            var cookie = request.GetCookie("next-auth.session-token");
            var jwt = _nextAuthHelper.GetJwt(cookie);
            var user = _userService.GetUser(Convert.ToInt32(jwt.id));
            return user;
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return null;
        }
    }
    
    public override void OnWsConnected(HttpRequest request)
    {
        var user = GetUser(request);
        if (user == null)
        {
            CloseUnauthorized();
            return;
        }


        _user = _userService.GetUserDetails(user.Id)!;

        var listCharPacket = new
        {
            type = ResponsePacketType.ListCharacters,
            data = _user.Characters
        };
        SendTextAsync(JsonConvert.SerializeObject(listCharPacket));

        Console.WriteLine($"Chat WebSocket session with Id {Id} connected!");

        // Send invite message
        string message = "Hello from WebSocket chat! Please send a message or '!' to disconnect the client!";
        //SendTextAsync(message);
    }

    public override void OnWsDisconnected()
    {
        Console.WriteLine($"Chat WebSocket session with Id {Id} disconnected!");
    }

    public override void OnWsReceived(byte[] buffer, long offset, long size)
    {
        string message = Encoding.UTF8.GetString(buffer, (int)offset, (int)size);
        Console.WriteLine("Incoming: " + message);

        // Multicast message to all connected sessions
        _wsServer.MulticastText(message);

        // If the buffer starts with '!' the disconnect the current session
        if (message == "!")
            Close(1000);
    }

    protected override void OnError(SocketError error)
    {
        Console.WriteLine($"Chat WebSocket session caught an error with code {error}");
    }
}