using System.Diagnostics;
using NetCoreGameServer.Websocket;

namespace NetCoreGameServer.Background;

public abstract class BaseBackgroundThread
{
    protected readonly GameManager GameManager;
    protected BaseBackgroundThread(GameManager gameManager)
    {
        GameManager = gameManager;
    }

    public async Task Run()
    {
        var stopwatch = new Stopwatch();
        while (true)
        {
            try
            {
                await Process();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }

            await Task.Delay(Math.Max(0, 50 - (int)stopwatch.ElapsedMilliseconds));//20 tick
            stopwatch.Restart();
        }
    }

    protected abstract Task Process();
}