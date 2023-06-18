using System.Data;
using dotenv.net;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using NetCoreGameServer.Data.Config;
using System.Net;
using MySql.Data.MySqlClient;
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
    private readonly UserService _userService;

    public Program(NextAuthHelper nextAuthHelper, IOptions<WebsocketConfig> websocketConfig, UserService userService)
    {
        _nextAuthHelper = nextAuthHelper;
        _userService = userService;
        _websocketConfig = websocketConfig.Value;
    }

    async Task Run()
    {
        var server = new EchoServer(IPAddress.Any, _websocketConfig.Port, _nextAuthHelper, _userService);

        // Start the server
        Console.Write("Server starting...");
        server.Start();
        Console.WriteLine("Done!");

        Console.WriteLine("Press Enter to stop the server or '!' to restart the server...");

        while(true)
        {
            string line = Console.ReadLine();
            if (string.IsNullOrEmpty(line))
                break;

            // Restart the server
            if (line == "!")
            {
                Console.Write("Server restarting...");
                server.Restart();
                Console.WriteLine("Done!");
            }

            // Multicast admin message to all sessions
            line = "(admin) " + line;
            server.MulticastText(line);
        }

        // Stop the server
        Console.Write("Server stopping...");
        server.Stop();
        Console.WriteLine("Done!");
    }

    static async Task Main(string[] args)
    {
        DotEnv.Load(new DotEnvOptions(true, probeForEnv: true, probeLevelsToSearch: 5));

        var configuration = new ConfigurationBuilder().AddEnvironmentVariables().Build();

        var services = new ServiceCollection();

        services.AddLogging();
        services.AddSingleton<Program>();
        services.AddSingleton<NextAuthHelper>();

        //db
        services.AddTransient<IDbConnection>(x => new MySqlConnection(configuration.GetConnectionString("DB")));
        services.AddTransient<UserService>();
        
        //configs
        services.Configure<NextAuthConfig>(configuration.GetSection("NEXTAUTH"));
        services.Configure<WebsocketConfig>(configuration.GetSection("WEBSOCKET"));

        var serviceProvider = services.BuildServiceProvider();

        JsonConvert.DefaultSettings = () => new JsonSerializerSettings()
        {
            ContractResolver = new CamelCasePropertyNamesContractResolver()
        };


        var program = serviceProvider.GetRequiredService<Program>();
        await program.Run();


        
    }
}