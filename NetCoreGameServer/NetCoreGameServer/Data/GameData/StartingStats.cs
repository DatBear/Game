using NetCoreGameServer.Data.Model;

namespace NetCoreGameServer.Data.GameData;

public class StartingStats
{
    private static Stats Stats(int str, int dex, int intel, int vit)
    {
        return new Stats
        {
            Strength = str,
            Dexterity = dex,
            Intelligence = intel,
            Vitality = vit,
        };
    }

    public Dictionary<CharacterClasses, Stats> ForClass = new()
    {
        { CharacterClasses.Fighter, Stats(50, 40, 10, 50) },
        { CharacterClasses.Barbarian, Stats(60, 25, 5, 60) },
        { CharacterClasses.Rogue, Stats(30, 60, 25, 35) },
        { CharacterClasses.Magician, Stats(20, 50, 60, 20) },
        { CharacterClasses.Guardian, Stats(30, 10, 55, 55) },
        { CharacterClasses.Samurai, Stats(45, 50, 10, 50) },
        { CharacterClasses.Paladin, Stats(55, 30, 20, 55) },
        { CharacterClasses.Monk, Stats(40, 65, 20, 40) },
        { CharacterClasses.Ninja, Stats(40, 70, 15, 45) },
        { CharacterClasses.Warlock, Stats(15, 45, 75, 35) },
        { CharacterClasses.Headhunter, Stats(55, 75, 5, 35) },
        { CharacterClasses.Alchemist, Stats(10, 40, 110, 15) },
    };
}