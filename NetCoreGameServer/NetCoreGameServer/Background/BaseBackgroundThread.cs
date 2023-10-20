using System.Diagnostics;
using NetCoreGameServer.Service;
using NetCoreGameServer.Websocket;

namespace NetCoreGameServer.Background;

public abstract class BaseBackgroundThread
{
    protected readonly double Ticks;
    protected readonly GameManager GameManager;

    protected BaseBackgroundThread(double ticks, GameManager gameManager)
    {
        Ticks = ticks;
        GameManager = gameManager;
    }

    public async Task Run()
    {
        var delay = 1000 / Ticks;
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

            await Task.Delay(Math.Max(0, (int)delay - (int)stopwatch.ElapsedMilliseconds));
            stopwatch.Restart();
        }
    }

    protected abstract Task Process();
}