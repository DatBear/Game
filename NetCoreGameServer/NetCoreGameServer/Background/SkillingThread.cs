﻿using NetCoreGameServer.Data.Network;
using NetCoreGameServer.Data.Network.Characters;
using NetCoreGameServer.Data.Network.Skills;
using NetCoreGameServer.Service;
using NetCoreGameServer.Websocket;

namespace NetCoreGameServer.Background;

public class SkillingThread : BaseBackgroundThread
{
    private static readonly Random r = new();


    public SkillingThread(GameManager gameManager) : base(gameManager)
    {
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
                if (session.User.CurrentSkill.IsWon())
                {
                    session.User.CurrentSkill.CompletedItem = ItemGenerator.GenerateSkillItem(session.User.SelectedCharacter!, session.User.CurrentSkill);
                    session.User.SelectedCharacter.AllItems.Add(session.User.CurrentSkill.CompletedItem);
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