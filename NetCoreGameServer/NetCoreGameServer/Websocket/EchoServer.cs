using System.Net;
using System.Net.Sockets;
using NetCoreGameServer.Helper;
using NetCoreGameServer.Service;
using NetCoreServer;

namespace NetCoreGameServer.Websocket;

class EchoServer : WsServer
{
    private readonly NextAuthHelper _nextAuthHelper;
    private readonly UserService _userService;

    public EchoServer(IPAddress address, int port, NextAuthHelper nextAuthHelper, UserService userService) : base(address, port)
    {
        _nextAuthHelper = nextAuthHelper;
        _userService = userService;
    }

    protected override TcpSession CreateSession()
    {
        return new EchoSession(this, _nextAuthHelper, _userService);
    }

    protected override void OnError(SocketError error)
    {
        Console.WriteLine($"Echo WebSocket server caught an error with code {error}");
    }
}