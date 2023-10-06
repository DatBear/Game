using System.Data;
using Dapper;
using NetCoreGameServer.Data.Model;

namespace NetCoreGameServer.Service;

public class CharacterRepository
{
    private readonly IDbConnection _db;

    public CharacterRepository(IDbConnection db)
    {
        _db = db;
    }

    public async Task<int> CreateCharacter(Character character)
    {

        var statId = await _db.QueryFirstAsync<int>($@"
            INSERT INTO Stats (EnhancedEffect, Strength, Dexterity, Vitality, Intelligence, MaxLife, MaxMana) 
                VALUES (0, @Strength, @Dexterity, @Vitality, @Intelligence, @MaxLife, @MaxMana);            
            SELECT LAST_INSERT_ID();
        ", character.Stats);

        character.StatsId = character.Stats.Id = statId;

        var charId = await _db.QueryFirstAsync<int>($@"
            INSERT INTO `Character` (
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
                (SELECT Id FROM CharacterClass WHERE LOWER(Name) = LOWER(@Class)),
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
        return charId;
    }
}