using MediatR;
using MySqlX.XDevAPI;
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

    public StopSkillHandler(GameSession session)
    {
        _session = session;
    }

    public async Task Handle(StopSkillRequest request, CancellationToken cancellationToken)
    {
        if (_session.User.CurrentSkill != null)
        {
            _session.User.CurrentSkill.Stop();

            var (addItem, removeItem) = ItemGenerator.GenerateSkillItem(_session.User.SelectedCharacter!, _session.User.CurrentSkill);
            _session.User.CurrentSkill.CompletedItem = addItem;
            if (addItem != null)
            {
                _session.User.SelectedCharacter.AllItems.Add(addItem);
            }

            if (removeItem != null && removeItem.Any())
            {
                _session.User.SelectedCharacter.AllItems.RemoveAll(x => removeItem.Contains(x));
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