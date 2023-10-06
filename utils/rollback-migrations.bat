cd ../NetCoreGameServer
dotnet build
dotnet run --project NetCoreGameServer.Migrations/NetCoreGameServer.Migrations.csproj -- -r %1
cd ../utils
pause