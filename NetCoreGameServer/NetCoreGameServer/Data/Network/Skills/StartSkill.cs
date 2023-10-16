using MediatR;
using NetCoreGameServer.Data.Model;
using NetCoreGameServer.Websocket;

namespace NetCoreGameServer.Data.Network.Skills;

public class StartSkillRequestData
{
    public SkillType Type { get; set; }
    public int? Level { get; set; }
    public int[] ItemIds { get; set; }
}

public class StartSkillRequest : BaseRequestPacket<StartSkillRequestData>, IRequest
{
    public override int Type => (int)RequestPacketType.StartSkill;
}

public class StartSkillResponse : BaseResponsePacket<SkillState>
{
    public override int Type => (int)ResponsePacketType.StartSkill;
}

public class StartSkillHandler : IRequestHandler<StartSkillRequest>
{
    private static Random r = new();
    private readonly GameSession _session;
    private readonly GameManager _gameManager;

    public StartSkillHandler(GameSession session, GameManager gameManager)
    {
        _session = session;
        _gameManager = gameManager;
    }

    public async Task Handle(StartSkillRequest request, CancellationToken cancellationToken)
    {
        if (_session.User.CurrentSkill is { IsCompleted: false })
        {
            _session.SendError("You can only start one skill at a time!");
        }

        var state = new SkillState
        {
            Type = request.Data.Type,
            Level = request.Data.Level ?? 1,
            Progress = new[] { 100, 0 },
            InputItems = request.Data.ItemIds.Select(x => _session.User.SelectedCharacter.AllItems.FirstOrDefault(item => item.Id == x)).Where(x => x != null).ToList()
        };
        state.Update(DateTimeOffset.UtcNow.ToUnixTimeMilliseconds());

        switch (request.Data.Type)
        {
            case SkillType.Fishing:
                if (_session.User.SelectedCharacter.Items.Count >= 16)
                {
                    _session.SendError("Your inventory is full.");
                    return;
                }
                break;
            case SkillType.Cooking:
                if (_session.User.SelectedCharacter.Items.Count >= 16)
                {
                    _session.SendError("Your inventory is full.");
                    return;
                }
                if (state.InputItems.Count != 1 || !state.InputItems.All(x => x is { SubType: ItemSubType.Fish } && x.Stats.ExperienceGained == 0))
                {
                    _session.SendError("An uncooked fish is required for cooking.");
                    return;
                }
                break;
        }

        _session.User.CurrentSkill = state;
        _session.Send(new StartSkillResponse
        {
            Data = state
        });
    }
}