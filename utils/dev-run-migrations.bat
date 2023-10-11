cd ../NetCoreGameServer
dotnet build
dotnet run --project NetCoreGameServer.Migrations/NetCoreGameServer.Migrations.csproj -- devdb
cd ../utils
pause