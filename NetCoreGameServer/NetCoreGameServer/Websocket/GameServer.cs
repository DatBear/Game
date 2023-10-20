using System.Net;
using System.Net.Sockets;
using MediatR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using NetCoreGameServer.Background;
using NetCoreGameServer.Helper;
using NetCoreGameServer.Service;
using NetCoreServer;

namespace NetCoreGameServer.Websocket;

public class GameServer : WsServer
{
    private readonly NextAuthHelper _nextAuthHelper;
    private readonly UserRepository _userRepository;
    private readonly IServiceCollection _serviceCollection;
    private readonly IServiceProvider _serviceProvider;
    private readonly IConfigurationRoot _config;

    private List<Func<BaseBackgroundThread>> _backgroundThreads => new()
    {
        () => _serviceProvider.GetService<DatabaseThread>()!,
        () => _serviceProvider.GetService<MobActionThread>()!,
        () => _serviceProvider.GetService<CharacterRegenThread>()!,
        () => _serviceProvider.GetService<SkillingThread>()!,
        () => _serviceProvider.GetService<GlyphThread>()!,
    };

    public GameServer(IPAddress address, int port, NextAuthHelper nextAuthHelper, UserRepository userRepository, IServiceCollection serviceCollection, IServiceProvider serviceProvider, IConfigurationRoot config) : base(address, port)
    {
        _nextAuthHelper = nextAuthHelper;
        _userRepository = userRepository;
        _serviceCollection = serviceCollection;
        _serviceProvider = serviceProvider;
        _config = config;
    }

    public override bool Start()
    {
        var success = base.Start();
        if (success)
        {
            foreach (var thread in _backgroundThreads.Select(x => x()))
            {
                Task.Factory.StartNew(async () => await thread.Run());
            }
            Console.WriteLine($"Server started on {Address}:{Port}.");
        }
        else
        {
            Console.WriteLine($"FAILED to start server on {Address}:{Port}");
        }

        return success;
    }

    protected override TcpSession CreateSession()
    {
        return new GameSession(this, _nextAuthHelper, _userRepository, _serviceCollection, _serviceProvider, _config);
    }

    protected override void OnError(SocketError error)
    {
        Console.WriteLine($"Echo WebSocket server caught an error with code {error}");
    }
}