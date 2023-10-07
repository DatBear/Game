using System.Data;
using dotenv.net;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using NetCoreGameServer.Data.Config;
using System.Net;
using MediatR;
using MySql.Data.MySqlClient;
using NetCoreGameServer.Data.Network.Characters;
using NetCoreGameServer.Extension;
using NetCoreGameServer.Helper;
using NetCoreGameServer.Service;
using NetCoreGameServer.Websocket;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace NetCoreGameServer;

internal class Program
{
    private readonly NextAuthHelper _nextAuthHelper;
    private readonly WebsocketConfig _websocketConfig;
    private readonly UserRepository _userRepository;
    private readonly IServiceCollection _serviceCollection;
    private readonly IConfigurationRoot _configuration;

    public Program(NextAuthHelper nextAuthHelper, IOptions<WebsocketConfig> websocketConfig, UserRepository userRepository, IServiceCollection serviceCollection, IConfigurationRoot configuration)
    {
        _nextAuthHelper = nextAuthHelper;
        _userRepository = userRepository;
        _serviceCollection = serviceCollection;
        _configuration = configuration;
        _websocketConfig = websocketConfig.Value;
    }

    async Task Run(IServiceProvider serviceProvider)
    {
        var server = new GameServer(IPAddress.Any, _websocketConfig.Port, _nextAuthHelper, _userRepository, _serviceCollection, serviceProvider, _configuration);

        // Start the server
        Console.WriteLine("Server starting...");
        server.Start();

        while (true)
        {
            await Task.Delay(1000);
        }

        // Stop the server
        Console.WriteLine("Server stopping...");
        server.Stop();
        Console.WriteLine("Done!");
    }

    static async Task Main(string[] args)
    {
        DotEnv.Load(new DotEnvOptions(true, probeForEnv: true, probeLevelsToSearch: 5));

        var configuration = new ConfigurationBuilder().AddEnvironmentVariables().Build();

        var services = new ServiceCollection();

        services.AddServices(configuration);


        services.AddSingleton<IServiceCollection>(services);
        services.AddSingleton(configuration);
        services.AddSingleton<SessionManager>();

        var serviceProvider = services.BuildServiceProvider();

        JsonConvert.DefaultSettings = () => new JsonSerializerSettings()
        {
            ContractResolver = new CamelCasePropertyNamesContractResolver()
        };

        var program = serviceProvider.GetRequiredService<Program>();
        await program.Run(serviceProvider);
    }
}