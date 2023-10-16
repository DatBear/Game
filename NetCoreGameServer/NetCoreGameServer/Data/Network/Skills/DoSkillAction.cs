using MediatR;
using NetCoreGameServer.Websocket;

namespace NetCoreGameServer.Data.Network.Skills;

public class DoSkillActionRequest : BaseRequestPacket<int?>, IRequest
{
    public override int Type => (int)RequestPacketType.DoSkillAction;
}

public class DoSkillActionHandler : IRequestHandler<DoSkillActionRequest>
{
    private readonly GameSession _session;

    public DoSkillActionHandler(GameSession session)
    {
        _session = session;
    }

    public async Task Handle(DoSkillActionRequest request, CancellationToken cancellationToken)
    {
        if (_session.User.CurrentSkill != null)
        {
            _session.User.CurrentSkill.HasActioned = true;
            _session.User.CurrentSkill.Counter = request.Data;
        }
    }
}