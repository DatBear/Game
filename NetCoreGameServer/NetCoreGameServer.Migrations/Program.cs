using System.Reflection;
using System.Runtime.CompilerServices;
using dotenv.net;
using FluentMigrator.Runner;
using Microsoft.Extensions.DependencyInjection;

namespace NetCoreGameServer.Migrations
{
    internal class Program
    {
        static void Main(string[] args)
        {
            DotEnv.Load(new DotEnvOptions(probeForEnv: true, probeLevelsToSearch: 5));

            var serviceProvider = CreateServices();
            using var scope = serviceProvider.CreateScope();

            try
            {
                if (args.Length > 1 && args[0] == "-r")
                {
                    Console.WriteLine($"Rolling DB back to version {args[1]}.");
                    RollbackDatabase(scope.ServiceProvider, (long)Convert.ToDouble(args[1]));
                }
                else
                {
                    Console.WriteLine("Running DB migrations");
                    UpdateDatabase(scope.ServiceProvider);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                Environment.Exit(1);
            }
        }

        private static IServiceProvider CreateServices()
        {
            var services = new ServiceCollection();
            services.AddFluentMigratorCore();
            services.ConfigureRunner(rb => rb.AddMySql5()
                                             .WithGlobalConnectionString(Environment.GetEnvironmentVariable("CONNECTIONSTRINGS__DB"))
                                             .ScanIn(typeof(Program).Assembly).For.Migrations()
                                             .WithGlobalCommandTimeout(Timeout.InfiniteTimeSpan)
            );
            services.AddLogging();
            
            return services.BuildServiceProvider(false);
        }

        private static void UpdateDatabase(IServiceProvider serviceProvider)
        {
            var runner = serviceProvider.GetRequiredService<IMigrationRunner>();
            runner.MigrateUp();
        }

        private static void RollbackDatabase(IServiceProvider serviceProvider, long version)
        {
            var runner = serviceProvider.GetRequiredService<IMigrationRunner>();
            runner.MigrateDown(version);
        }
    }
}