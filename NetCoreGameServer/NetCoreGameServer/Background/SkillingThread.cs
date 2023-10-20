using NetCoreGameServer.Data.Network;
using NetCoreGameServer.Data.Network.Characters;
using NetCoreGameServer.Data.Network.Skills;
using NetCoreGameServer.Service;
using NetCoreGameServer.Websocket;

namespace NetCoreGameServer.Background;

public class SkillingThread : BaseBackgroundThread
{
    private static readonly Random r = new();

    private readonly DatabaseThread _dbThread;

    public SkillingThread(GameManager gameManager, DatabaseThread dbThread) : base(20, gameManager)
    {
        _dbThread = dbThread;
    }

    protected override async Task Process()
    {
        var tick = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
        var sessions = GameManager.GetSessions().Where(x => x.User.CurrentSkill != null);
        foreach (var session in sessions)
        {
            if (session.User.CurrentSkill is { IsCompleted: false })
            {
                var update = session.User.CurrentSkill.Update(tick);
                if (session.User.CurrentSkill.IsWon() || session.User.CurrentSkill.IsLost())
                {
                    var (addItem, removeItem) = ItemGenerator.GenerateSkillItem(session.User.SelectedCharacter!, session.User.CurrentSkill);
                    session.User.CurrentSkill.CompletedItem = addItem;
                    if (addItem != null)
                    {
                        await _dbThread.CreateItem(addItem);
                        session.User.SelectedCharacter.AllItems.Add(addItem);
                    }

                    if (removeItem != null && removeItem.Any())
                    {
                        foreach (var item in removeItem)
                        {
                            if (item.Unstack())
                            {
                                session.User.SelectedCharacter.AllItems.Remove(item);
                                await _dbThread.DeleteItem(item);
                            }
                            else
                            {
                                await _dbThread.UpdateItem(item);
                            }
                        }
                    }

                    session.Send(new UpdateCharacterResponse
                    {
                        Data = session.User.SelectedCharacter
                    });
                }

                if (update)
                {
                    session.Send(new UpdateSkillResponse
                    {
                        Data = session.User.CurrentSkill
                    });
                }
            }
        }
    }
}