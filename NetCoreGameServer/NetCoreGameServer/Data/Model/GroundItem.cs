using NetCoreGameServer.Websocket;
using Newtonsoft.Json;

namespace NetCoreGameServer.Data.Model;

public class GroundItem
{
    private static readonly Random r = new Random();
    public Item Item { get; set; }
    public long ExpiresTimestamp { get; set; }
    public bool HasGroupClicked { get; set; }
    public bool HasUserClicked { get; set; }

    [JsonIgnore]
    public readonly List<User> PickAttempted = new();

    public User? FindWinner(GameManager gameManager)
    {
        var availableWinners = PickAttempted.Where(x => gameManager.GetSession(x.Id) != null && x.SelectedCharacter != null && x.SelectedCharacter.CanPickItem(Item)).ToList();
        if (availableWinners.Count == 0) return null;
        var winner = availableWinners[r.Next(availableWinners.Count)];
        return winner;
    }
}