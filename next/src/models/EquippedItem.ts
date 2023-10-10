import Item from "./Item";

export enum EquippedItemSlot {
  Weapon,
  Armor,
  Charm,
  AccCharm
}

const slotNames: Record<EquippedItemSlot, string> = {
  [EquippedItemSlot.Weapon]: "Weapon",
  [EquippedItemSlot.Armor]: "Armor",
  [EquippedItemSlot.Charm]: "Charm",
  [EquippedItemSlot.AccCharm]: "Acc. Charm"
}

export { slotNames };