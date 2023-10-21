using System.Collections.Concurrent;
using System.Diagnostics;
using NetCoreGameServer.Data.Model;
using NetCoreGameServer.Service;
using NetCoreGameServer.Websocket;

namespace NetCoreGameServer.Background;

public class DatabaseThread : BaseBackgroundThread
{
    private readonly Stopwatch _stopwatch = new();
    private readonly ConcurrentDictionary<int, Character> _characters = new();
    private readonly ConcurrentDictionary<int, Item> _items = new();

    private readonly CharacterRepository _characterRepository; 
    private readonly ItemRepository _itemRepository;
    
    public DatabaseThread(CharacterRepository characterRepository, ItemRepository itemRepository) : base(.1, null)
    {
        _characterRepository = characterRepository;
        _itemRepository = itemRepository;
    }

    protected override async Task Process()
    {
        _stopwatch.Restart();
        int characters = _characters.Count;
        int items = _items.Count;
        if (_characters.Any())
        {
            await _characterRepository.UpdateCharacters(_characters.Values);
            _characters.Clear();
        }

        if (_items.Any())
        {
            await _itemRepository.UpdateItems(_items.Values);
            _items.Clear();
        }
        Console.WriteLine($"Updated database ({characters} characters, {items} items) in {_stopwatch.ElapsedMilliseconds} ms.");
    }

    public async Task<bool> CreateItem(Item item)
    {
        return await _itemRepository.CreateItem(item);
    }

    public async Task<bool> DeleteItem(Item item)
    {
        return await _itemRepository.DeleteItem(item);
    }

    public async Task<bool> UpdateCharacter(Character character)
    {
        _characters.TryAdd(character.Id, character);
        return true;
    }

    public async Task<bool> UpdateItem(Item item)
    {
        _items.TryAdd(item.Id, item);
        return true;
    }

    public async Task<bool> ForceCharacterUpdate(Character? character)
    {
        if (character == null) return false;
        await _characterRepository.UpdateCharacter(character);
        var items = character.AllItems.Select(x =>
        {
            _items.TryGetValue(x.Id, out var item);
            return item;
        }).Where(x => x != null);
        await _itemRepository.UpdateItems(items);
        Console.WriteLine($"Force updated {items.Count()} items");
        return true;
    }
}