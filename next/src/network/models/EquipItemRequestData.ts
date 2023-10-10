import { EquippedItemSlot } from "@/models/EquippedItem";

export type EquipItemRequestData = {
  itemId: number;
  equippedItemSlot: EquippedItemSlot;
};