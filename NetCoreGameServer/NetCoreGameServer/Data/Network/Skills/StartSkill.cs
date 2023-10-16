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
        var state = new SkillState
        {
            Type = request.Data.Type,
            Level = request.Data.Level ?? 1,
            //todo get inputItems from request
        };

        switch (request.Data.Type)
        {
            case SkillType.Fishing:
                if (_session.User.SelectedCharacter.Items.Count >= 16)
                {
                    _session.SendError("Your inventory is full.");
                    return;
                }

                state.Progress = new[] { 100, 0 };
                state.Update(DateTimeOffset.UtcNow.ToUnixTimeMilliseconds());
                break;
        }

        _session.User.CurrentSkill = state;
        _session.Send(new StartSkillResponse
        {
            Data = state
        });
    }
}