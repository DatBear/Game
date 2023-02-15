import { EquippedItemSlot } from "@/models/EquippedItem";
import Item, { classArmors, classCharms, classWeapons, ItemSubType, ItemType } from "@/models/Item";
import { useCallback } from "react";
import { UIWindow, useWindow } from "./contexts/UIContext";
import { useCharacter, useUser } from "./contexts/UserContext";
import ItemSlot from "./ItemSlot";
import Window from "./Window";

// let gearItems: Item[] = [
//   { subType: ItemSubType.Club, stats: Array(1), tier: 3 },
//   { subType: ItemSubType.Robe, stats: Array(1), tier: 3 },
//   { subType: ItemSubType.Fire, stats: Array(1), tier: 3 },
//   { subType: ItemSubType.Fire, stats: Array(1), tier: 3 },
// ]

// let gear: { item: Item, slot: string, acceptType: ItemType }[] = [
//   { slot: 'Weapon', item: gearItems[0], acceptType: ItemType.Weapon },
//   { slot: 'Armor', item: gearItems[1], acceptType: ItemType.Armor },
//   { slot: 'Charm', item: gearItems[2], acceptType: ItemType.Charm },
//   { slot: 'Acc. Charm', item: gearItems[3], acceptType: ItemType.Charm },
// ];

let equipmentItems: Item[] = [
  { subType: ItemSubType.Club, stats: Array(1), tier: 4 },
  { subType: ItemSubType.Club, stats: Array(1), tier: 3 },
  { subType: ItemSubType.PaddedRobe, stats: Array(1), tier: 3 },
  { subType: ItemSubType.Fire, stats: Array(1), tier: 3 },
  { subType: ItemSubType.Fire, stats: Array(1), tier: 3 },
]

let items: Item[] = [
  { subType: ItemSubType.Fish, stats: Array(1), tier: 3, quantity: 12 },
  { subType: ItemSubType.Fish, stats: Array(1), tier: 3, quantity: 1 },
  { subType: ItemSubType.Fish, stats: Array(1), tier: 3, quantity: 20 },
]

let equipmentSlots = 10;
let itemSlots = 16;

function InventoryWindow() {
  const { character } = useCharacter();
  const { closeWindow } = useWindow(UIWindow.Inventory);

  let equippedSlots = Object.values(EquippedItemSlot);
  let equippableGear: Record<EquippedItemSlot, ItemSubType[]> = {
    [EquippedItemSlot.Weapon]: [...classWeapons[character.class]],
    [EquippedItemSlot.Armor]: [...classArmors[character.class]],
    [EquippedItemSlot.Charm]: [...classCharms[character.class]],
    [EquippedItemSlot.AccCharm]: [...classCharms[character.class]]
  }

  return (<>
    <Window close={() => closeWindow()}>
      <Window.Title>Inventory</Window.Title>
      <div>
        <div className="flex flex-row gap-7">
          {equippedSlots.map((s, idx) => {
            let slot = character?.equippedItems.find(x => x.slot == s);
            return <div key={idx} className="flex flex-col items-center">
              <span className="block text-center">{s}</span>
              <ItemSlot item={slot?.item} acceptSubTypes={equippableGear[s]} acceptMaxTier={Math.floor(3 + character.level / 5)} />
            </div>
          })}
        </div>
      </div>
      <div>
        <span>Equipment ({equipmentItems.length}/{equipmentSlots})</span>
        <div className="grid grid-cols-5 gap-x-2 gap-y-3">
          {equipmentItems.concat([...Array(equipmentSlots - equipmentItems.length)]).map((x, idx) => {
            return <ItemSlot key={idx} item={x} />
          })}
        </div>
      </div>
      <div>
        <span>Items</span>
        <div className="flex flex-wrap place-content-center gap-x-2 gap-y-3">
          <div className="grid grid-cols-8 gap-x-2 gap-y-2">
            {items.concat([...Array(itemSlots - items.length)]).map((x, idx) => {
              return <ItemSlot key={idx} item={x} small />
            })}
          </div>
        </div>
      </div>
    </Window>
  </>);
}

export default InventoryWindow;