using MediatR;
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
            _session.Send(new UpdateSkillResponse
            {
                Data = _session.User.CurrentSkill
            });

            _session.User.CurrentSkill = null;
        }
    }
}