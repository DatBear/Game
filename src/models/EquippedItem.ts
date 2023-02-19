import Item, { ItemType } from "./Item";

export enum EquippedItemSlot {
  Weapon = "Weapon",
  Armor = "Armor",
  Charm = "Charm",
  AccCharm = "Acc. Charm"
}

type EquippedItem = {
  item: Item;
  slot: EquippedItemSlot;
}

export default EquippedItem;