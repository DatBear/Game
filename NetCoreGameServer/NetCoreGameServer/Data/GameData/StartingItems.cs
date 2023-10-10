using NetCoreGameServer.Data.Model;

namespace NetCoreGameServer.Data.GameData;

public class StartingItems
{
    public static Dictionary<CharacterClasses, List<(EquippedItemSlot slot, ItemSubType subType)>> ForClass = new()
    {
        { CharacterClasses.Fighter, new() { (EquippedItemSlot.Weapon, ItemSubType.Sword) } },
        { CharacterClasses.Barbarian, new() { (EquippedItemSlot.Weapon, ItemSubType.Club) } },
        {
            CharacterClasses.Rogue,
            new()
            {
                (EquippedItemSlot.Weapon, ItemSubType.Dagger),
                (EquippedItemSlot.Armor, ItemSubType.ScaleArmor), //todo remove
                (EquippedItemSlot.Charm, ItemSubType.Lightning),
            }
        },
        {
            CharacterClasses.Magician,
            new()
            {
                (EquippedItemSlot.Weapon, ItemSubType.Staff),
                (EquippedItemSlot.Charm, ItemSubType.Fire),
            }
        },
        {
            CharacterClasses.Guardian,
            new()
            {
                (EquippedItemSlot.Weapon, ItemSubType.Club),
                (EquippedItemSlot.Charm, ItemSubType.Heal),
            }
        },
    };
}