FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src

COPY NetCoreGameServer/NetCoreGameServer/NetCoreGameServer.csproj .
RUN dotnet restore "NetCoreGameServer.csproj"

COPY ./NetCoreGameServer/NetCoreGameServer ./

#WORKDIR "/src/NetCoreGameServer"
RUN dotnet build "NetCoreGameServer.csproj" -c Release -o /app/build

FROM build as publish
RUN dotnet publish "NetCoreGameServer.csproj" -c Release -o /app/publish

FROM base as final
WORKDIR /app
COPY --from=publish /app/publish .

ENTRYPOINT ["dotnet", "NetCoreGameServer.dll"]