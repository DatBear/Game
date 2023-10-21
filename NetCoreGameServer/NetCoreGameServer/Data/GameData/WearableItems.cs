using NetCoreGameServer.Data.Model;

namespace NetCoreGameServer.Data.GameData;

public class WearableItems
{
    public static Dictionary<ItemType, ItemSubType[]> ItemTypes = new()
    {
        { ItemType.Weapon, new[] { ItemSubType.Sword, ItemSubType.Club, ItemSubType.Axe, ItemSubType.Dagger, ItemSubType.Staff, ItemSubType.Longsword, ItemSubType.Warhammer, ItemSubType.Battleaxe, ItemSubType.Spear, ItemSubType.Polearm } },
        { ItemType.Armor, new[] { ItemSubType.Robe, ItemSubType.PaddedRobe, ItemSubType.LeatherArmor, ItemSubType.ScaleArmor, ItemSubType.ChainMail, ItemSubType.PlateMail } },
        { ItemType.Charm, new[] { ItemSubType.Ice, ItemSubType.Fire, ItemSubType.Lightning, ItemSubType.Wind, ItemSubType.Earth, ItemSubType.WildHeal, ItemSubType.Heal, ItemSubType.FocusedHeal } },
        { ItemType.Item, new[] { ItemSubType.Fish, ItemSubType.Glyph, ItemSubType.Comfrey, ItemSubType.Potion, ItemSubType.Totem, ItemSubType.Map } },
        { ItemType.Object, new[] { ItemSubType.FishingRod, ItemSubType.Essence } },
    };

    public static readonly Dictionary<CharacterClasses, ItemSubType[]> ClassWeapons = new()
    {
        { CharacterClasses.Fighter, new[] { ItemSubType.Sword, ItemSubType.Club, ItemSubType.Axe, ItemSubType.Longsword, ItemSubType.Polearm, ItemSubType.Spear } },
        { CharacterClasses.Barbarian, new[] { ItemSubType.Sword, ItemSubType.Club, ItemSubType.Axe, ItemSubType.Warhammer, ItemSubType.Battleaxe, ItemSubType.Polearm } },
        { CharacterClasses.Rogue, new[] { ItemSubType.Sword, ItemSubType.Club, ItemSubType.Axe, ItemSubType.Dagger, ItemSubType.Staff, ItemSubType.Spear } },
        { CharacterClasses.Magician, new[] { ItemSubType.Staff, ItemSubType.Dagger } },
        { CharacterClasses.Guardian, new[] { ItemSubType.Club, ItemSubType.Longsword, ItemSubType.Warhammer, ItemSubType.Battleaxe, ItemSubType.Spear, ItemSubType.Polearm } },
        { CharacterClasses.Samurai, new[] { ItemSubType.Sword, ItemSubType.Dagger, ItemSubType.Longsword } },
        { CharacterClasses.Paladin, new[] { ItemSubType.Sword, ItemSubType.Club, ItemSubType.Axe, ItemSubType.Longsword, ItemSubType.Warhammer, ItemSubType.Battleaxe, ItemSubType.Polearm } },
        { CharacterClasses.Monk, new[] { ItemSubType.Dagger, ItemSubType.Staff, ItemSubType.Spear } },
        { CharacterClasses.Ninja, new[] { ItemSubType.Sword, ItemSubType.Dagger, ItemSubType.Spear } },
        { CharacterClasses.Warlock, new[] { ItemSubType.Staff } },
        { CharacterClasses.Headhunter, new[] { ItemSubType.Axe, ItemSubType.Battleaxe } },
        { CharacterClasses.Alchemist, Array.Empty<ItemSubType>() },
    };

    public static readonly Dictionary<CharacterClasses, ItemSubType[]> ClassArmors = new()
    {
        { CharacterClasses.Fighter, ItemTypes[ItemType.Armor] },
        { CharacterClasses.Barbarian, ItemTypes[ItemType.Armor] },
        { CharacterClasses.Rogue, new[] { ItemSubType.Robe, ItemSubType.PaddedRobe, ItemSubType.LeatherArmor, ItemSubType.ScaleArmor } },
        { CharacterClasses.Magician, new[] { ItemSubType.Robe, ItemSubType.PaddedRobe } },
        { CharacterClasses.Guardian, new[] { ItemSubType.ChainMail, ItemSubType.PlateMail } },
        { CharacterClasses.Samurai, ItemTypes[ItemType.Armor] },
        { CharacterClasses.Paladin, ItemTypes[ItemType.Armor] },
        { CharacterClasses.Monk, new[] { ItemSubType.Robe, ItemSubType.PaddedRobe } },
        { CharacterClasses.Ninja, new[] { ItemSubType.Robe, ItemSubType.PaddedRobe } },
        { CharacterClasses.Warlock, new[] { ItemSubType.Robe, ItemSubType.PaddedRobe } },
        { CharacterClasses.Headhunter, new[] { ItemSubType.Robe, ItemSubType.PaddedRobe, ItemSubType.LeatherArmor, ItemSubType.ScaleArmor } },
        { CharacterClasses.Alchemist, new[] { ItemSubType.Robe, ItemSubType.PaddedRobe } },
    };

    public static readonly Dictionary<CharacterClasses, ItemSubType[]> ClassCharms = new()
    {
        { CharacterClasses.Fighter, ItemTypes[ItemType.Charm] },
        { CharacterClasses.Barbarian, ItemTypes[ItemType.Charm] },
        { CharacterClasses.Rogue, ItemTypes[ItemType.Charm] },
        { CharacterClasses.Magician, ItemTypes[ItemType.Charm] },
        { CharacterClasses.Guardian, new[] { ItemSubType.WildHeal, ItemSubType.Heal, ItemSubType.FocusedHeal } },
        { CharacterClasses.Samurai, ItemTypes[ItemType.Charm] },
        { CharacterClasses.Paladin, ItemTypes[ItemType.Charm] },
        { CharacterClasses.Monk, ItemTypes[ItemType.Charm] },
        { CharacterClasses.Ninja, ItemTypes[ItemType.Charm] },
        { CharacterClasses.Warlock, ItemTypes[ItemType.Charm] },
        { CharacterClasses.Headhunter, new[] { ItemSubType.Lightning } },
        { CharacterClasses.Alchemist, ItemTypes[ItemType.Charm] },
    };

    public static ItemType GetItemType(ItemSubType? type)
    {
        if (type == null) return ItemType.Weapon;
        return ItemTypes.FirstOrDefault(p => p.Value.Contains(type.Value)).Key;
    }
}