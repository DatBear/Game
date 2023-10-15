using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MySql.Data.MySqlClient;
using NetCoreGameServer.Data.Config;
using NetCoreGameServer.Helper;
using NetCoreGameServer.Service;
using NetCoreGameServer.Websocket;
using System.Configuration;
using System.Data;

namespace NetCoreGameServer.Extension;

public static class ServiceCollectionExtensions
{
    public static void AddSharedServices(this IServiceCollection services, IConfigurationRoot config)
    {
        services.AddLogging();
        services.AddSingleton<Program>();
        services.AddSingleton<NextAuthHelper>();

        //db
        services.AddTransient<IDbConnection>(x => new MySqlConnection(config.GetConnectionString("DB")));
        services.AddTransient<UserRepository>();
        services.AddTransient<CharacterRepository>();
        services.AddTransient<ItemRepository>();

        //configs
        services.Configure<NextAuthConfig>(config.GetSection("NEXTAUTH"));
        services.Configure<WebsocketConfig>(config.GetSection("WEBSOCKET"));
    }
}