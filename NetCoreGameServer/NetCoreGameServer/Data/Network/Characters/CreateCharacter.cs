using MediatR;
using NetCoreGameServer.Data.GameData;
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
    private readonly ItemRepository _itemRepository;


    public CreateCharacterHandler(CharacterRepository characterRepository, UserRepository userRepository, GameSession session, ItemRepository itemRepository)
    {
        _characterRepository = characterRepository;
        _userRepository = userRepository;
        _session = session;
        _itemRepository = itemRepository;
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

        await _characterRepository.CreateCharacter(character);
        
        if (StartingItems.ForClass.TryGetValue((CharacterClasses)character.ClassId, out var startingItems))
        {
            foreach (var itemProps in startingItems)
            {
                var item = new Item
                {
                    OwnerId = character.Id,
                    SubType = itemProps.subType,
                    EquippedItemSlot = itemProps.slot,
                    Tier = 1
                };

                item = await _itemRepository.CreateItem(item);
                character.AllItems.Add(item);
            }
        }

        

        _session.User.Characters.Add(character);
        _session.Send(new ListCharactersResponse
        {
            Data = _session.User.Characters.ToArray()
        });
    }
}