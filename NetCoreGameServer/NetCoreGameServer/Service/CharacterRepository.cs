using System.Data;
using Dapper;
using NetCoreGameServer.Data;
using NetCoreGameServer.Data.GameData;
using NetCoreGameServer.Data.Model;

namespace NetCoreGameServer.Service;

public class CharacterRepository
{
    private readonly IDbConnection _db;

    public CharacterRepository(IDbConnection db)
    {
        _db = db;
    }

    public async Task<Character?> GetByName(string name)
    {
        var sql = $@"SELECT c.* FROM {TableNames.Character} c where Name = @name";
        var result = await _db.QueryFirstOrDefaultAsync<Character>(sql, new { name });
        return result;
    }

    public async Task<bool> CreateCharacter(Character character)
    {
        var classId = await _db.QueryFirstAsync<int>($@"SELECT Id FROM {TableNames.CharacterClass} WHERE LOWER(Name) = LOWER(@Class)", character);
        character.ClassId = classId;

        character.Stats = StartingStats.ForClass[(CharacterClasses)character.ClassId];
        character.Stats.LifeRegen = 3;
        character.Stats.ManaRegen = 2;
        character.Stats.MaxLife = character.Life = 100;
        character.Stats.MaxMana = character.Mana = 100;

        if (!await CreateStats(character.Stats))
        {
            throw new Exception("Failed to insert stats in db.");
        }
        character.StatsId = character.Stats.Id;
        
        var charId = await _db.QueryFirstAsync<int>($@"
            INSERT INTO {TableNames.Character} (
                UserId,
                Name,
                Level, 
                ClassId,
                Gender,
                Core,
                Life,
                Mana,
                Experience,
                StatPoints,
                AbilityPoints,
                EquipmentSlots,
                Kills,
                Deaths,
                StatsId
            ) 
            VALUES (
                @UserId,
                @Name,
                @Level,
                @ClassId,
                @Gender,
                @Core,
                @Life,
                @Mana,
                @Experience,
                @StatPoints,
                @AbilityPoints,
                @EquipmentSlots,
                @Kills,
                @Deaths,
                @StatsId
            );
        SELECT LAST_INSERT_ID();
        ", character);

        character.Id = charId;
        return true;
    }

    private async Task<bool> CreateStats(Stats stats)
    {
        var statId = await _db.QueryFirstAsync<int>($@"
            INSERT INTO {TableNames.Stats} (EnhancedEffect, Strength, Dexterity, Vitality, Intelligence, MaxLife, MaxMana) 
                VALUES (0, @Strength, @Dexterity, @Vitality, @Intelligence, @MaxLife, @MaxMana);            
            SELECT LAST_INSERT_ID();
        ", stats);
        stats.Id = stats.Id = statId;
        return true;
    }

    public async Task<bool> UpdateCharacter(Character? character)
    {
        if (character == null) return false;

        if (!await UpdateStats(character.Stats))
        {
            throw new Exception("Failed to update stats in db.");
        }

        var sql = $@"UPDATE {TableNames.Character} SET 
                UserId = @UserId,
                Name = @Name,
                Level = @Level,
                ClassId = @ClassId,
                Gender = @Gender,
                Core = @Core,
                Life = @Life,
                Mana = @Mana,
                Experience = @Experience,
                StatPoints = @StatPoints,
                AbilityPoints = @AbilityPoints,
                EquipmentSlots = @EquipmentSlots,
                Kills = @Kills,
                Deaths = @Deaths,
                StatsId = @StatsId
            WHERE Id = @Id";
        await _db.ExecuteAsync(sql, character);
        return true;
    }

    public async Task<bool> UpdateCharacters(IEnumerable<Character> characters)
    {
        if (!await UpdateMultipleStats(characters.Select(x => x.Stats)))
        {
            throw new Exception("Failed to update stats in db.");
        }

        var sql = $@"UPDATE {TableNames.Character} SET 
                UserId = @UserId,
                Name = @Name,
                Level = @Level,
                ClassId = @ClassId,
                Gender = @Gender,
                Core = @Core,
                Life = @Life,
                Mana = @Mana,
                Experience = @Experience,
                StatPoints = @StatPoints,
                AbilityPoints = @AbilityPoints,
                EquipmentSlots = @EquipmentSlots,
                Kills = @Kills,
                Deaths = @Deaths,
                StatsId = @StatsId
            WHERE Id = @Id";
        await _db.ExecuteAsync(sql, characters);
        return true;
    }

    private async Task<bool> UpdateStats(Stats stats)
    {
        var sql = $@"UPDATE {TableNames.Stats} SET
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
                Jubilance = @Jubilance
            WHERE Id = @Id";
        await _db.ExecuteAsync(sql, stats);
        return true;
    }

    private async Task<bool> UpdateMultipleStats(IEnumerable<Stats> stats)
    {
        var sql = $@"UPDATE {TableNames.Stats} SET
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
                Jubilance = @Jubilance
            WHERE Id = @Id";
        await _db.ExecuteAsync(sql, stats);
        return true;
    }
}