using MediatR;
using MySqlX.XDevAPI;
using NetCoreGameServer.Background;
using NetCoreGameServer.Data.Network.Characters;
using NetCoreGameServer.Service;
using NetCoreGameServer.Websocket;

namespace NetCoreGameServer.Data.Network.Skills;

public class StopSkillRequest: BaseRequestPacket<NullData>, IRequest
{
    public override int Type => (int)RequestPacketType.StopSkill;
}

public class StopSkillHandler : IRequestHandler<StopSkillRequest>
{
    private readonly GameSession _session;
    private readonly DatabaseThread _dbThread;

    public StopSkillHandler(GameSession session, DatabaseThread dbThread)
    {
        _session = session;
        _dbThread = dbThread;
    }

    public async Task Handle(StopSkillRequest request, CancellationToken cancellationToken)
    {
        if (_session.User.CurrentSkill != null && _session.User.SelectedCharacter != null)
        {
            _session.User.CurrentSkill.Stop();

            var (addItem, removeItem) = ItemGenerator.GenerateSkillItem(_session.User.SelectedCharacter!, _session.User.CurrentSkill);
            _session.User.CurrentSkill.CompletedItem = addItem;
            if (addItem != null)
            {
                await _dbThread.CreateItem(addItem);
                _session.User.SelectedCharacter.AllItems.Add(addItem);
            }

            if (removeItem != null && removeItem.Any())
            {
                foreach (var item in removeItem)
                {
                    if (item.Unstack())
                    {
                        _session.User.SelectedCharacter.AllItems.Remove(item);
                        await _dbThread.DeleteItem(item);
                    }
                    else
                    {
                        await _dbThread.UpdateItem(item);
                    }
                }
            }

            _session.Send(new UpdateCharacterResponse
            {
                Data = _session.User.SelectedCharacter
            });

            _session.Send(new UpdateSkillResponse
            {
                Data = _session.User.CurrentSkill
            });

            _session.User.CurrentSkill = null;
        }
    }
}