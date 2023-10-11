using System.Data;
using Dapper;
using NetCoreGameServer.Data;
using NetCoreGameServer.Data.Model;

namespace NetCoreGameServer.Service;

public class ItemRepository
{
    private readonly IDbConnection _db;

    public ItemRepository(IDbConnection db)
    {
        _db = db;
    }

    public async Task<Item> CreateItem(Item item)
    {
        //todo add other stats
        var statId = await _db.QueryFirstAsync<int>($@"
            INSERT INTO {TableNames.ItemStats} (EnhancedEffect, Strength, Dexterity, Vitality, Intelligence, MaxLife, MaxMana) 
                VALUES (0, @Strength, @Dexterity, @Vitality, @Intelligence, @MaxLife, @MaxMana);
            SELECT LAST_INSERT_ID();
        ", item.Stats);

        item.ItemStatsId = statId;

        var itemId = await _db.QueryFirstAsync<int>($@"
            INSERT INTO {TableNames.Item} (
                Tier,
                Quantity,
                SubType,
                Position,
                EquippedItemSlot,
                OwnerId,
                ItemStatsId
            ) 
            VALUES (
                @Tier,
                @Quantity,
                @SubType,
                @Position,
                @EquippedItemSlot,
                @OwnerId,
                @ItemStatsId
            );
        SELECT LAST_INSERT_ID();
        ", item);

        item.Id = itemId;
        return item;
    }

    public async Task DeleteItem(Item itemToDelete)
    {
        await _db.ExecuteAsync($@"
            DELETE FROM {TableNames.Item} WHERE Id = @Id;
            DELETE FROM {TableNames.ItemStats} WHERE Id = @ItemStatsId;
        ", itemToDelete);
    }
}