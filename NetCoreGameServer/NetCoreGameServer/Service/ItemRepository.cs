using System.Data;
using Dapper;
using MySql.Data.MySqlClient;
using NetCoreGameServer.Data;
using NetCoreGameServer.Data.Model;
using NetCoreGameServer.Data.Network.Items;

namespace NetCoreGameServer.Service;

public class ItemRepository
{
    private readonly IDbConnection _db;

    public ItemRepository(IDbConnection db)
    {
        _db = db;
    }

    public async Task<bool> CreateItem(Item item)
    {
        var statId = await _db.QueryFirstAsync<int>($@"
            INSERT INTO {TableNames.ItemStats} (EnhancedEffect, Strength, Dexterity, Vitality, Intelligence, MaxLife, MaxMana, ExperienceGained, MagicLuck, LifeRegen, ManaRegen, ExtraEquipmentSlots, CriticalStrike, LifePerAttack, ManaPerAttack, LifePerKill, ManaPerKill, LifeSteal, DamageReturn, MindNumb, ArmorPierce, Parry, CriticalFlux, PhysicalDamageReduction, MagicalDamageReduction, ManaSiphon, QuickDraw, ManaConsumption, IceMastery, FireMastery, LightningMastery, EarthMastery, WindMastery, HealMastery, ManaSkin, PowerShot, GlancingBlow, Jubilance, WarmLights, EvilPresences, TreasureChests, Rooms, WarmLightEffectiveness, MonsterDifficulty, ItemDrops, ItemQuantity, Swarm, GuildPoints, LevelUp, LevelCap) 
                VALUES (@EnhancedEffect, @Strength, @Dexterity, @Vitality, @Intelligence, @MaxLife, @MaxMana, @ExperienceGained, @MagicLuck, @LifeRegen, @ManaRegen, @ExtraEquipmentSlots, @CriticalStrike, @LifePerAttack, @ManaPerAttack, @LifePerKill, @ManaPerKill, @LifeSteal, @DamageReturn, @MindNumb, @ArmorPierce, @Parry, @CriticalFlux, @PhysicalDamageReduction, @MagicalDamageReduction, @ManaSiphon, @QuickDraw, @ManaConsumption, @IceMastery, @FireMastery, @LightningMastery, @EarthMastery, @WindMastery, @HealMastery, @ManaSkin, @PowerShot, @GlancingBlow, @Jubilance, @WarmLights, @EvilPresences, @TreasureChests, @Rooms, @WarmLightEffectiveness, @MonsterDifficulty, @ItemDrops, @ItemQuantity, @Swarm, @GuildPoints, @LevelUp, @LevelCap);
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
                ItemStatsId,
                ExpiresAt
            ) 
            VALUES (
                @Tier,
                @Quantity,
                @SubType,
                @Position,
                @EquippedItemSlot,
                @OwnerId,
                @ItemStatsId,
                @ExpiresAt
            );
        SELECT LAST_INSERT_ID();
        ", item);

        item.Id = itemId;
        return true;
    }

    public async Task<bool> UpdateItem(Item item, IDbTransaction transaction = null)
    {
        await UpdateItemStats(new[] { item.Stats });

        var sql = $@"UPDATE {TableNames.Item} SET
            Tier = @Tier,
            Quantity = @Quantity,
            SubType = @SubType,
            Position = @Position,
            EquippedItemSlot = @EquippedItemSlot,
            OwnerId = @OwnerId,
            ExpiresAt = @ExpiresAt
        WHERE Id = @Id";
        await _db.ExecuteAsync(sql, item, transaction);
        return true;
    }

    public async Task<bool> UpdateItems(IEnumerable<Item> items)
    {
        if (!items.Any()) return false;

        await UpdateItemStats(items.Select(x => x.Stats));

        var sql = $@"UPDATE {TableNames.Item} SET
            Tier = @Tier,
            Quantity = @Quantity,
            SubType = @SubType,
            Position = @Position,
            EquippedItemSlot = @EquippedItemSlot,
            OwnerId = @OwnerId,
            ExpiresAt = @ExpiresAt
        WHERE Id = @Id";
        await _db.ExecuteAsync(sql, items);
        return true;
    }

    private async Task<bool> UpdateItemStats(IEnumerable<ItemStats> stats, IDbTransaction transaction = null)
    {
        var sql = $@"UPDATE {TableNames.ItemStats} SET 
            EnhancedEffect = @EnhancedEffect,
            Strength = @Strength,
            Dexterity = @Dexterity,
            Vitality = @Vitality,
            Intelligence = @Intelligence,
            MaxLife = @MaxLife,
            MaxMana = @MaxMana,
            ExperienceGained = @ExperienceGained,
            MagicLuck = @MagicLuck,
            LifeRegen = @LifeRegen,
            ManaRegen = @ManaRegen,
            ExtraEquipmentSlots = @ExtraEquipmentSlots,
            CriticalStrike = @CriticalStrike,
            LifePerAttack = @LifePerAttack,
            ManaPerAttack = @ManaPerAttack,
            LifePerKill = @LifePerKill,
            ManaPerKill = @ManaPerKill,
            LifeSteal = @LifeSteal,
            DamageReturn = @DamageReturn,
            MindNumb = @MindNumb,
            ArmorPierce = @ArmorPierce,
            Parry = @Parry,
            CriticalFlux = @CriticalFlux,
            PhysicalDamageReduction = @PhysicalDamageReduction,
            MagicalDamageReduction = @MagicalDamageReduction,
            ManaSiphon = @ManaSiphon,
            QuickDraw = @QuickDraw,
            ManaConsumption = @ManaConsumption,
            IceMastery = @IceMastery,
            FireMastery = @FireMastery,
            LightningMastery = @LightningMastery,
            EarthMastery = @EarthMastery,
            WindMastery = @WindMastery,
            HealMastery = @HealMastery,
            ManaSkin = @ManaSkin,
            PowerShot = @PowerShot,
            GlancingBlow = @GlancingBlow,
            Jubilance = @Jubilance,
            WarmLights = @WarmLights,
            EvilPresences = @EvilPresences,
            TreasureChests = @TreasureChests,
            Rooms = @Rooms,
            WarmLightEffectiveness = @WarmLightEffectiveness,
            MonsterDifficulty = @MonsterDifficulty,
            ItemDrops = @ItemDrops,
            ItemQuantity = @ItemQuantity,
            Swarm = @Swarm,
            GuildPoints = @GuildPoints,
            LevelUp = @LevelUp,
            LevelCap = @LevelCap
        WHERE Id = @Id";
        await _db.ExecuteAsync(sql, stats, transaction);
        return true;
    }

    public async Task<bool> DeleteItem(Item item)
    {
        await _db.ExecuteAsync($@"
            DELETE FROM {TableNames.Item} WHERE Id = @Id;
            DELETE FROM {TableNames.ItemStats} WHERE Id = @ItemStatsId;
        ", item);
        return true;
    }

    public async Task<bool> CreateMarketItem(MarketItem marketItem)
    {
        _db.Open();
        using var transaction = _db.BeginTransaction();
        try
        {
            await UpdateItem(marketItem.Item, transaction);

            var id = await _db.QueryFirstAsync<int>($@"
            INSERT INTO {TableNames.MarketItem} (
                ItemId,
                UserId,
                Price,
                ExpiresAt
            ) VALUES(
                @ItemId,
                @UserId,
                @Price,
                @ExpiresAt
            );
            SELECT LAST_INSERT_ID();", marketItem, transaction);
            marketItem.Id = id;
            transaction.Commit();
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            transaction.Rollback();
            return false;
        }
        finally
        {
            _db.Close();
        }

        return true;
    }

    public async Task<bool> BuyMarketItem(MarketItem item, User user)
    {
        _db.Open();
        using var transaction = _db.BeginTransaction();
        try
        {
            await _db.ExecuteAsync($@"DELETE FROM {TableNames.MarketItem} WHERE Id = @Id", item);
            await UpdateItem(item.Item, transaction);
            await _db.ExecuteAsync($@"UPDATE {TableNames.User} SET Gold = Gold + @Price WHERE Id = @UserId", item);
            await _db.ExecuteAsync($@"UPDATE {TableNames.User} SET Gold = Gold - @Price WHERE Id = @UserId", new { UserId = user.Id, Price = item.Price });
            transaction.Commit();
            user.Gold -= item.Price;
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            transaction.Rollback();
            return false;
        }
        finally
        {
            _db.Close();
        }

        return true;
    }

    public async Task<bool> UpdateMarketItemPrice(MarketItem item)
    {
        await _db.ExecuteAsync($@"UPDATE {TableNames.MarketItem} SET Price = @Price WHERE Id = @Id", item);
        return true;
    }

    public async Task<List<MarketItem>> SearchMarketItems(SearchMarketItemsDbRequest request)
    {
        var sql = $@"SELECT 
            mi.*,
            i.*,
            stats.*
        FROM {TableNames.MarketItem} mi
        INNER JOIN {TableNames.Item} i ON mi.ItemId = i.Id
        INNER JOIN {TableNames.ItemStats} stats ON i.ItemStatsId = stats.Id
        /**where**/";
        var builder = new SqlBuilder();
        var template = builder.AddTemplate(sql);

        if (request.SubType.HasValue)
        {
            builder.Where("i.SubType = @SubType");
        }

        if (request.MinTier.HasValue)
        {
            builder.Where("i.Tier >= @MinTier");
        }

        if (request.MaxTier.HasValue)
        {
            builder.Where("i.Tier <= @MaxTier");
        }

        if (request.MinCost.HasValue)
        {
            builder.Where("mi.Price >= @MinCost");
        }

        if (request.MaxCost.HasValue)
        {
            builder.Where("mi.Price <= @MaxCost");
        }

        var items = await _db.QueryAsync<MarketItem, Item, ItemStats, MarketItem>(template.RawSql, (marketItem, item, stats) =>
        {
            marketItem.Item = item;
            item.Stats = stats;
            return marketItem;
        }, request);

        return items.ToList();
    }

    public async Task<MarketItem?> GetMarketItem(int id)
    {
        var sql = $@"SELECT 
            mi.*,
            i.*,
            stats.*
        FROM {TableNames.MarketItem} mi
        INNER JOIN {TableNames.Item} i ON mi.ItemId = i.Id
        INNER JOIN {TableNames.ItemStats} stats ON i.ItemStatsId = stats.Id
        WHERE mi.Id = @Id";
        var item = await _db.QueryAsync<MarketItem, Item, ItemStats, MarketItem>(sql, (marketItem, item, stats) =>
        {
            if (marketItem != null)
            {
                marketItem.Item = item;
                marketItem.Item.Stats = stats;
            }
            return marketItem;
        }, new { Id = id });
        return item.FirstOrDefault();
    }

    public async Task<bool> DeleteMarketItem(MarketItem item, Character character)
    {
        _db.Open();
        var transaction = _db.BeginTransaction();
        try
        {
            await _db.ExecuteAsync($@"DELETE FROM {TableNames.MarketItem} WHERE Id = @Id", item);
            await _db.ExecuteAsync($@"UPDATE {TableNames.Item} SET OwnerId = @OwnerId WHERE Id = @Id", item.Item);
            transaction.Commit();
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            transaction.Rollback();
            return false;
        }
        finally
        {
            _db.Close();
        }

        return true;
    }
}