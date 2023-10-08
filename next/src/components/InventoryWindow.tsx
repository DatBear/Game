import { EquippedItemSlot } from "@/models/EquippedItem";
import Item, { classArmors, classCharms, classWeapons, ItemSubType } from "@/models/Item";
import { UIWindow, UIWindowState, useWindow } from "./contexts/UIContext";
import { useCharacter, useUser } from "./contexts/UserContext";
import ItemSlot from "./ItemSlot";
import Window from "./Window";

let itemSlots = 16;

function InventoryWindow() {
  const { character } = useCharacter();
  const { windowState, closeWindow } = useWindow<UIWindowState>(UIWindow.Inventory);

  let equippedSlots = Object.values(EquippedItemSlot);
  let equippableGear: Record<EquippedItemSlot, ItemSubType[]> = {
    [EquippedItemSlot.Weapon]: [...classWeapons[character.class]],
    [EquippedItemSlot.Armor]: [...classArmors[character.class]],
    [EquippedItemSlot.Charm]: [...classCharms[character.class]],
    [EquippedItemSlot.AccCharm]: [...classCharms[character.class]]
  }

  return (<>
    <Window isVisible={windowState!.isVisible} close={() => closeWindow()}>
      <Window.Title>Inventory</Window.Title>
      <div>
        <div className="flex flex-row gap-7">
          {equippedSlots.map((s, idx) => {
            let slot = character?.equippedItems.find(x => x.slot == s);
            return <div key={slot?.item.id ?? idx} className="flex flex-col items-center">
              <span className="block text-center w-max">{s}</span>
              <ItemSlot item={slot?.item} slot={s} acceptSubTypes={equippableGear[s]} acceptMaxTier={Math.floor(3 + character.level / 5)} />
            </div>
          })}
        </div>
      </div>
      <div>
        <span>Equipment ({character.equipment.length}/{character.equipmentSlots})</span>
        <div className="grid grid-cols-5 gap-x-2 gap-y-3">
          {character.equipment.concat([...Array(character.equipmentSlots - character.equipment.length)]).map((x, idx) => {
            return <ItemSlot key={x?.id ?? idx} item={x} />
          })}
        </div>
      </div>
      <div>
        <span>Items</span>
        <div className="flex flex-wrap place-content-center gap-x-2 gap-y-3">
          <div className="grid grid-cols-8 gap-x-2 gap-y-2">
            {character.items.concat([...Array(16 - character.items.length)]).map((x, idx) => {
              return <ItemSlot key={idx} item={x} small />
            })}
          </div>
        </div>
      </div>
    </Window>
  </>);
}

export default InventoryWindow;