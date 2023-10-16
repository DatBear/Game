using NetCoreGameServer.Data.Model;

namespace NetCoreGameServer.Data.Network.Skills;

public class UpdateSkillResponse : BaseResponsePacket<SkillState>
{
    public override int Type => (int)ResponsePacketType.UpdateSkill;
}