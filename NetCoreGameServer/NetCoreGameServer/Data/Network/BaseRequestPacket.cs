namespace NetCoreGameServer.Data.Network;

public interface IRequestPacket
{
    int Type { get; }
}

public abstract class BaseRequestPacket<T> : BasePacket<T>, IRequestPacket
{
}