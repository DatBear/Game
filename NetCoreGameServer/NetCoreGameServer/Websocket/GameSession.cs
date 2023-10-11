using System.Configuration;
using System.Diagnostics;
using System.Net;
using System.Net.Sockets;
using System.Reflection;
using System.Text;
using MediatR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using NetCoreGameServer.Data.Config;
using NetCoreGameServer.Data.Model;
using NetCoreGameServer.Data.Network;
using NetCoreGameServer.Data.Network.Characters;
using NetCoreGameServer.Extension;
using NetCoreGameServer.Helper;
using NetCoreGameServer.Service;
using NetCoreServer;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Nito.AsyncEx;

namespace NetCoreGameServer.Websocket;

public class GameSession : WsSession
{
    private WsServer _wsServer => (WsServer)Server;

    private readonly NextAuthHelper _nextAuthHelper;
    private readonly UserRepository _userRepository;
    private readonly IServiceCollection _serviceCollection;
    private readonly IServiceProvider _serviceProvider;
    private readonly IConfigurationRoot _config;

    public User User { get; set; }

    public GameSession(WsServer server, NextAuthHelper nextAuthHelper, UserRepository userRepository, IServiceCollection serviceCollection, IServiceProvider serviceProvider, IConfigurationRoot config) : base(server)
    {
        _nextAuthHelper = nextAuthHelper;
        _userRepository = userRepository;
        _serviceCollection = serviceCollection;
        _serviceProvider = serviceProvider;
        _config = config;
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
            var user = _userRepository.GetUser(Convert.ToInt32(jwt.id));
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

        User = _userRepository.GetUserDetails(user.Id)!;
        Console.WriteLine($"WebSocket session with Id {Id} connected!");
        var gameManager = _serviceProvider.GetService<GameManager>()!;
        if (gameManager.RemoveSession(User.Id))
        {
            CloseUnauthorized();
        }
        gameManager!.SetSession(User.Id, this);
    }

    public bool Send<T>(T obj) where T : IResponsePacket
    {
        return SendTextAsync(JsonConvert.SerializeObject(obj));
    }

    public bool SendAll<T>(T obj) where T : IResponsePacket
    {
        return _wsServer.MulticastText(JsonConvert.SerializeObject(obj));
    }

    public bool SendError(string message)
    {
        return Send(new ErrorResponse
        {
            Data = new ErrorMessage
            {
                Message = message
            }
        });
    }

    public override void OnWsDisconnected()
    {
        if (User != null)
        {
            _serviceProvider.GetService<GameManager>()!.RemoveSession(User.Id);
        }
        Console.WriteLine($"WebSocket session with Id {Id} disconnected!");
        
    }

    public override void OnWsReceived(byte[] buffer, long offset, long size)
    {
        var message = Encoding.UTF8.GetString(buffer, (int)offset, (int)size);

        if (message == null)
        {
            return;
        }

        Console.WriteLine($"Incoming: {message} from user: {User?.Username}");
        var nullPacket = JsonConvert.DeserializeObject<NullPacket>(message);

        var stopwatch = new Stopwatch();
        stopwatch.Start();

        var serviceCollection = CreateServiceCollection();
        var provider = serviceCollection.BuildServiceProvider();

        var mediator = provider.GetRequiredService<IMediator>();
        var mapper = provider.GetRequiredService<PacketMapper>();
        var packet = mapper.Deserialize((RequestPacketType)nullPacket.Type, message);
        if (packet != null)
        {
            try
            {
                AsyncContext.Run(async () => await mediator.Send(packet));
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }
        }
        Console.WriteLine($"time: {stopwatch.ElapsedMilliseconds}ms");
    }

    private ServiceCollection CreateServiceCollection()
    {
        var collection = new ServiceCollection();
        collection.AddServices(_config);

        collection.AddMediatR(x => x.RegisterServicesFromAssembly(typeof(ListCharactersHandler).Assembly));
        collection.AddSingleton(this);
        Assembly.GetAssembly(typeof(IRequestPacket))!.GetTypesAssignableFrom<IRequestPacket>()
                .ForEach(x => collection.AddTransient(typeof(IRequestPacket), x));
        collection.AddTransient<PacketMapper>();

        collection.AddSingleton(_serviceProvider.GetService<GameManager>()!);

        return collection;
    }

    protected override void OnError(SocketError error)
    {
        Console.WriteLine($"WebSocket session caught an error with code {error}");
    }
}