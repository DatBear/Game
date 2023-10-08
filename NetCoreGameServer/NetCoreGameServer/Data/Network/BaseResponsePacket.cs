namespace NetCoreGameServer.Data.Network;

public interface IResponsePacket
{
}

public abstract class BaseResponsePacket<T> : BasePacket<T>, IResponsePacket
{
}