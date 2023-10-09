using MediatR;
using NetCoreGameServer.Data.Model;
using NetCoreGameServer.Websocket;

namespace NetCoreGameServer.Data.Network.Groups;

public class SetGroupLeader
{
    public class SetGroupLeaderRequest : BaseRequestPacket<int>, IRequest
    {
        public override int Type => (int)RequestPacketType.SetGroupLeader;
    }

    public class SetGroupLeaderResponse : BaseResponsePacket<int>
    {
        public override int Type => (int)ResponsePacketType.SetGroupLeader;
    }

    public class SetGroupLeaderHandler : IRequestHandler<SetGroupLeaderRequest>
    {
        private readonly GameSession _session;
        private readonly GameManager _gameManager;

        public SetGroupLeaderHandler(GameSession session, GameManager gameManager)
        {
            _session = session;
            _gameManager = gameManager;
        }

        public async Task Handle(SetGroupLeaderRequest request, CancellationToken cancellationToken)
        {
            var group = _session.User.Group;
            var newLeader = group?.Users.FirstOrDefault(x => x.User.Id == request.Data);
            var isLeader = _session.User.Id == _session.User?.Group?.Id;
            if (group == null || newLeader == null || !isLeader)
            {
                _session.SendError("Unable to change the group leader");
                return;
            }
            
            _gameManager.SetGroupLeader(group, request.Data);
        }
    }
}