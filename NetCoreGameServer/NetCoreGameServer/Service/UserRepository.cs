using System.Data;
using Dapper;
using NetCoreGameServer.Data;
using NetCoreGameServer.Data.Model;

namespace NetCoreGameServer.Service;

public class UserRepository
{
    private readonly IDbConnection _db;

    public UserRepository(IDbConnection db)
    {
        _db = db;
    }

    public User? GetUser(int id)
    {
        return _db.QueryFirst<User>($"SELECT Id, Username, Email FROM {TableNames.User} WHERE Id = @Id", new { Id = id });
    }

    public User? GetUserDetails(int id)
    {
        var chars = new List<Character>();
        var charItems = new Dictionary<int, List<Item>>();
        var user = _db.Query<User, Character, Stats, Item, ItemStats, User>(@$"SELECT
                u.*
                , c.*, cc.Name as Class
                , s.*
                , i.*
                , itemStats.*
            FROM {TableNames.User} u
            LEFT JOIN {TableNames.Character} c ON c.UserId = u.Id
            LEFT JOIN {TableNames.CharacterClass} cc ON c.ClassId = cc.Id
            LEFT JOIN {TableNames.Stats} s ON c.StatsId = s.Id
            LEFT JOIN {TableNames.Item} i ON i.OwnerId = c.Id
            LEFT JOIN {TableNames.ItemStats} itemStats ON i.ItemStatsId = itemStats.Id
            WHERE u.Id = @Id;
        ", (user, character, stats, item, itemStats) =>
        {
            if (character != null)
            {
                chars.Add(character);
                character.Stats = stats;
                if (item != null)
                {
                    charItems.TryGetValue(character.Id, out var items);
                    items ??= new List<Item>();
                    item.Stats = itemStats;
                    items.Add(item);
                    charItems[character.Id] = items;
                    character.AllItems = items;
                }
            }
            user.Characters = chars;
            return user;
        }, new { Id = id }).FirstOrDefault();

        var marketItems = _db.Query<MarketItem, Item, ItemStats, MarketItem>($@"SELECT
            mi.*
            , mii.*
            , itemStats.*
            FROM {TableNames.MarketItem} mi
            LEFT JOIN {TableNames.Item} mii on mi.ItemId = mii.id
            LEFT JOIN {TableNames.ItemStats} itemStats on mii.ItemStatsId = itemStats.Id
            WHERE mi.UserId = @Id
        ", (marketItem, item, itemStats) =>
        {
            if (marketItem != null)
            {
                marketItem.Item = item;
                marketItem.Item.Stats = itemStats;
            }
            return marketItem;
        }, user);

        user.Characters = user.Characters.DistinctBy(x => x.Id).ToList();
        user.MarketItems = marketItems.DistinctBy(x => x.Id).ToList();
        return user;
    }
}