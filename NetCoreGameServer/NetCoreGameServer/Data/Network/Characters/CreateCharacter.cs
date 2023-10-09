using MediatR;
using NetCoreGameServer.Data.Model;
using NetCoreGameServer.Service;
using NetCoreGameServer.Websocket;

namespace NetCoreGameServer.Data.Network.Characters;

public class CreateCharacterRequest : BaseRequestPacket<Character>, IRequest
{
    public override int Type => (int)RequestPacketType.CreateCharacter;
}

public class CreateCharacterResponse : BaseResponsePacket<Character>
{
    public override int Type => (int)ResponsePacketType.CreateCharacter;
}

public class CreateCharacterHandler : IRequestHandler<CreateCharacterRequest>
{
    private readonly CharacterRepository _characterRepository;
    private readonly UserRepository _userRepository;
    private readonly GameSession _session;


    public CreateCharacterHandler(CharacterRepository characterRepository, UserRepository userRepository, GameSession session)
    {
        _characterRepository = characterRepository;
        _userRepository = userRepository;
        _session = session;
    }

    public async Task Handle(CreateCharacterRequest request, CancellationToken cancellationToken)
    {
        var character = request.Data;

        var existingCharacter = await _characterRepository.GetByName(character.Name);
        if (existingCharacter != null)
        {
            _session.SendError("A character with that name already exists.");
            return;
        }

        character.UserId = _session.User!.Id;
        character.Stats = new Stats
        {
            Dexterity = 1,
            Strength = 2,
            Intelligence = 3,
            Vitality = 4,
            MaxLife = 101,
            MaxMana = 100,
        };
        character.Level = 1;
        character.Life = character.Stats.MaxLife;
        character.Mana = character.Stats.MaxMana;
        character.EquipmentSlots = 8;
        character.StatPoints = 10;

        var id = await _characterRepository.CreateCharacter(character);
        character.Id = id;

        _session.User.Characters.Add(character);
        _session.Send(new ListCharactersResponse
        {
            Data = _session.User.Characters.ToArray()
        });
    }
}