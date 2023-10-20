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

    public async Task<bool> UpdateItem(Item item)
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
        await _db.ExecuteAsync(sql, item);
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

    private async Task<bool> UpdateItemStats(IEnumerable<ItemStats> stats)
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
        await _db.ExecuteAsync(sql, stats);
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
}