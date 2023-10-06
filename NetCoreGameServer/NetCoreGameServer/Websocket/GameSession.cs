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

namespace NetCoreGameServer.Websocket;

public class GameSession : WsSession
{
    private WsServer _wsServer => (WsServer)Server;

    private readonly NextAuthHelper _nextAuthHelper;
    private readonly UserService _userService;
    private readonly IServiceCollection _serviceCollection;
    private readonly IServiceProvider _serviceProvider;
    private readonly IConfigurationRoot _config;

    private User? _user;

    public GameSession(WsServer server, NextAuthHelper nextAuthHelper, UserService userService, IServiceCollection serviceCollection, IServiceProvider serviceProvider, IConfigurationRoot config) : base(server)
    {
        _nextAuthHelper = nextAuthHelper;
        _userService = userService;
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

        //var listCharPacket = new
        //{
        //    type = ResponsePacketType.ListCharacters,
        //    data = _user.Characters
        //};

        ////SendTextAsync(JsonConvert.SerializeObject(listCharPacket));
        //Send(listCharPacket);

        Console.WriteLine($"Chat WebSocket session with Id {Id} connected!");
    }

    public bool Send<T>(T obj)
    {
        return SendTextAsync(JsonConvert.SerializeObject(obj));
    }

    public override void OnWsDisconnected()
    {
        Console.WriteLine($"Chat WebSocket session with Id {Id} disconnected!");
    }

    public override void OnWsReceived(byte[] buffer, long offset, long size)
    {
        string message = Encoding.UTF8.GetString(buffer, (int)offset, (int)size);
        Console.WriteLine($"Incoming: {message} from user: {_user?.Id}");

        var nullPacket = JsonConvert.DeserializeObject<NullPacket>(message);

        var stopwatch = new Stopwatch();
        stopwatch.Start();
        var serviceCollection = CreateServiceCollection();

        serviceCollection.AddMediatR(x => x.RegisterServicesFromAssembly(typeof(ListCharactersHandler).Assembly));
        serviceCollection.AddSingleton(this);
        serviceCollection.AddSingleton(_user);
        Assembly.GetAssembly(typeof(IRequestPacket)).GetTypesAssignableFrom<IRequestPacket>()
                .ForEach(x => serviceCollection.AddTransient(typeof(IRequestPacket), x));
        serviceCollection.AddTransient<PacketMapper>();

        var provider = serviceCollection.BuildServiceProvider();

        var mediator = provider.GetRequiredService<IMediator>();
        var mapper = provider.GetRequiredService<PacketMapper>();
        var packet = mapper.Deserialize((RequestPacketType)nullPacket.PacketType, message);
        mediator.Send(packet);
        Console.WriteLine($"time: {stopwatch.ElapsedMilliseconds}ms");

        //switch ((RequestPacketType)nullPacket.PacketType)
        //{
        //    case RequestPacketType.ListCharacters:
        //        break;
        //}
    }

    private ServiceCollection CreateServiceCollection()
    {
        var collection = new ServiceCollection();
        collection.AddServices(_config);
        return collection;
    }

    protected override void OnError(SocketError error)
    {
        Console.WriteLine($"Chat WebSocket session caught an error with code {error}");
    }
}