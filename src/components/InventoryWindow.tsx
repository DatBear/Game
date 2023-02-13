import Item, { ItemSubType } from "@/models/Item";
import gs from '@/styles/game.module.css'
import ItemSlot from "./ItemSlot";
import Window from "./Window";

let equipmentItems: Item[] = [
  { subType: ItemSubType.Club, stats: Array(1), tier: 3 },
  { subType: ItemSubType.PaddedRobe, stats: Array(1), tier: 3 },
  { subType: ItemSubType.Fire, stats: Array(1), tier: 3 },
  { subType: ItemSubType.Fire, stats: Array(1), tier: 3 },
]

let gearItems: Item[] = [
  { subType: ItemSubType.Club, stats: Array(1), tier: 3 },
  { subType: ItemSubType.Robe, stats: Array(1), tier: 3 },
  { subType: ItemSubType.Fire, stats: Array(1), tier: 3 },
  { subType: ItemSubType.Fire, stats: Array(1), tier: 3 },
]

let gear: { item: Item, slot: string }[] = [
  { slot: 'Weapon', item: gearItems[0] },
  { slot: 'Armor', item: gearItems[1] },
  { slot: 'Charm', item: gearItems[2] },
  { slot: 'Acc. Charm', item: gearItems[3] },
];

let items: Item[] = [
  { subType: ItemSubType.Fish, stats: Array(1), tier: 3, quantity: 12 },
  { subType: ItemSubType.Fish, stats: Array(1), tier: 3, quantity: 1 },
  { subType: ItemSubType.Fish, stats: Array(1), tier: 3, quantity: 20 },
]

let equipmentSlots = 10;
let itemSlots = 16;

function InventoryWindow() {
  return (<>
    <Window>
      <Window.Title>Inventory</Window.Title>
      <div>
        <div className="flex flex-row gap-7">
          {gear.map((x, idx) => {
            return <div key={idx} className="flex flex-col items-center">
              <span className="block text-center">{x.slot}</span>
              <ItemSlot item={x.item} />
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