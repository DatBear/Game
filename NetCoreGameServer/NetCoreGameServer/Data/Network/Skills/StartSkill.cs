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
            InputItems = request.Data.ItemIds
                                .Select(x => _session.User.SelectedCharacter.AllItems.FirstOrDefault(item => item.Id == x))
                                .Where(x => x != null).Select(x => x!)
                                .OrderBy(x => x.SubType)
                                .Take(2).ToList()
        };
        state.Update(DateTimeOffset.UtcNow.ToUnixTimeMilliseconds());

        var firstItem = state.InputItems.Count > 0 ? state.InputItems[0] : null;
        var secondItem = state.InputItems.Count > 1 ? state.InputItems[1] : null;

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
            case SkillType.Glyphing:
                if (state.InputItems.Count == 0)
                {
                    _session.SendError("Glyphing requires one item or two glyphs.");
                    return;
                }

                if (firstItem is { SubType: < ItemSubType.Fish } && secondItem != null)
                {
                    if (secondItem != null)
                    {
                        _session.SendError("Glyphing an item requires an empty second slot.");
                        return;
                    }

                    if (_session.User.SelectedCharacter.Items.Count >= 16)
                    {
                        _session.SendError("Your inventory is full.");
                        return;
                    }
                }

                if (firstItem is { SubType: ItemSubType.Glyph } && secondItem is not { SubType: ItemSubType.Glyph })
                {
                    //todo add tier/overlapping stats restriction
                    _session.SendError("Combining glyphs requires two glyphs of the same tier without overlapping stats.");
                    return;
                }

                break;
            case SkillType.Transmuting:
                if (state.InputItems.Count == 0 || firstItem is { SubType: >= ItemSubType.Fish })
                {
                    _session.SendError("Transmuting requires one item or an item and an essence.");
                    return;
                }

                if (firstItem is { SubType: < ItemSubType.Fish })
                {
                    if (firstItem.Stats.NumStats() <= 0 && secondItem == null)
                    {
                        _session.SendError("Transmuting an item to an essence requires magical or higher items.");
                        return;
                    }

                    if (secondItem != null)
                    {
                        if (firstItem.Stats.NumStats() > 0 || secondItem.SubType != ItemSubType.Essence)
                        {
                            _session.SendError("Transmuting an item requires a normal item and an essence.");
                            return;
                        }

                        if (firstItem.Tier != secondItem.Tier)
                        {
                            _session.SendError("Both items must be the same tier.");
                            return;
                        }
                    }

                    if (_session.User.SelectedCharacter.Items.Count >= 16 && secondItem == null)
                    {
                        _session.SendError("Your inventory is full.");
                        return;
                    }
                }

                break;
            case SkillType.Suffusencing:
                if (state.InputItems.Count == 0 || firstItem is not { SubType: ItemSubType.Fish or ItemSubType.Glyph } || secondItem is not { SubType: ItemSubType.Essence })
                {
                    _session.SendError("Suffusencing requires a fish or glyph and an essence to enhance it with.");
                    return;
                }

                if (firstItem.Stats.EnhancedEffect > 0)
                {
                    _session.SendError("That item has already been enhanced.");
                    return;
                }

                if (firstItem.Tier != secondItem.Tier)
                {
                    _session.SendError("Items must be the same tier.");
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