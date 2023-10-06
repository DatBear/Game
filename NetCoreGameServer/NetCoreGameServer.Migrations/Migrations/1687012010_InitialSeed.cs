using FluentMigrator;

namespace NetCoreGameServer.Migrations.Migrations;

[Migration(1687012010)]
public class InitialSeed : Migration {
    public override void Up()
    {
        //user: test//test
        Execute.Sql(@"
        INSERT INTO User (Id, Email, Password, Username) VALUES (1, 'test@test.com', '$2b$12$5KX9VWgIOovEM5nxFAR3j.E6BeZ2xs3gRISS92pRPtBtXwKcnDYV2', 'test');
            
        INSERT INTO Stats (Id, EnhancedEffect, Strength, Dexterity, Vitality, Intelligence, MaxLife, MaxMana) VALUES (1, 0, 0, 0, 0, 0, 100, 100);
        INSERT INTO Stats (Id, EnhancedEffect, Strength, Dexterity, Vitality, Intelligence, MaxLife, MaxMana) VALUES (2, 0, 0, 0, 0, 0, 101, 101);

        INSERT INTO CharacterClass (Id, Name) VALUES (0, 'Fighter');
        INSERT INTO CharacterClass (Id, Name) VALUES (1, 'Barbarian');
        INSERT INTO CharacterClass (Id, Name) VALUES (2, 'Rogue');
        INSERT INTO CharacterClass (Id, Name) VALUES (3, 'Magician');
        INSERT INTO CharacterClass (Id, Name) VALUES (4, 'Guardian');
        INSERT INTO CharacterClass (Id, Name) VALUES (5, 'Samurai');
        INSERT INTO CharacterClass (Id, Name) VALUES (6, 'Paladin');
        INSERT INTO CharacterClass (Id, Name) VALUES (7, 'Monk');
        INSERT INTO CharacterClass (Id, Name) VALUES (8, 'Ninja');
        INSERT INTO CharacterClass (Id, Name) VALUES (9, 'Warlock');
        INSERT INTO CharacterClass (Id, Name) VALUES (10, 'Headhunter');
        INSERT INTO CharacterClass (Id, Name) VALUES (11, 'Alchemist');

        INSERT INTO `Character` (Id, UserId, Name, Level, ClassId, Gender, Core, Life, Mana, Experience, StatPoints, AbilityPoints, EquipmentSlots, Kills, Deaths, StatsId) VALUES (1, 1, 'datbear', 1, 0, 0, 0, 100, 100, 0, 10, 0, 8, 0, 0, 1);
        INSERT INTO `Character` (Id, UserId, Name, Level, ClassId, Gender, Core, Life, Mana, Experience, StatPoints, AbilityPoints, EquipmentSlots, Kills, Deaths, StatsId) VALUES (2, 1, 'datbear2', 1, 0, 0, 0, 100, 100, 0, 10, 0, 8, 0, 0, 2);
        ");
    }

    public override void Down()
    {
        Execute.Sql(@"
        delete from `Character` where 1 = 1;
        delete from Stats where 1 = 1;
        delete from CharacterClass where 1 = 1;
        delete from User where 1 = 1;
        ");
    }
}