import { EquippedItemSlot, slotNames } from "@/models/EquippedItem";
import Item, { classArmors, classCharms, classWeapons, ItemSubType } from "@/models/Item";
import { UIWindowState, useWindow } from "./contexts/UIContext";
import { useCharacter, useUser } from "./contexts/UserContext";
import ItemSlot from "./ItemSlot";
import Window from "./Window";
import { ItemAction } from "@/models/ItemAction";
import { UIWindow } from "@/models/UIWindow";

const itemSlots = 16;

function InventoryWindow() {
  const { character } = useCharacter();
  const { windowState, closeWindow } = useWindow<UIWindowState>(UIWindow.Inventory);

  let equippedSlots = Object.values(EquippedItemSlot).filter(x => !isNaN(Number(x))).map(x => x as EquippedItemSlot);
  let equippableGear: Record<EquippedItemSlot, ItemSubType[]> = {
    [EquippedItemSlot.Weapon]: [...classWeapons[character.class]],
    [EquippedItemSlot.Armor]: [...classArmors[character.class]],
    [EquippedItemSlot.Charm]: [...classCharms[character.class]],
    [EquippedItemSlot.AccCharm]: [...classCharms[character.class]]
  }

  return <Window isVisible={windowState!.isVisible} close={closeWindow} coords={windowState!.coords} type={windowState!.type}>
    <Window.Title>Inventory</Window.Title>
    <div>
      <div className="flex flex-row gap-7">
        {equippedSlots.map((s, idx) => {
          let itemSlot = character?.equippedItems.find(x => x.equippedItemSlot == s);
          return <div key={itemSlot?.id ?? idx - 5} className="flex flex-col items-center">
            <span className="block text-center w-max">{slotNames[s]}</span>
            {/*@ts-ignore*/}
            <ItemSlot item={itemSlot} acceptSubTypes={equippableGear[s]} acceptMaxTier={Math.floor(3 + character.level / 5)} slot={s} />
          </div>
        })}
      </div>
    </div>
    <div>
      <span>Equipment ({character.equipment.length}/{character.equipmentSlots})</span>
      <div className="grid grid-cols-5 gap-x-2 gap-y-3">
        {character.equipment.concat([...Array(Math.max(0, character.equipmentSlots - character.equipment.length))]).map((x, idx) => {
          return <ItemSlot key={x?.id ?? idx - character.equipmentSlots - 1} item={x} action={ItemAction.Swap} />
        })}
      </div>
    </div>
    <div>
      <span>Items</span>
      <div className="flex flex-wrap place-content-center gap-x-2 gap-y-3 items-center">
        <ItemSlot medium hotkey="Use Item" action={ItemAction.Use} />
        <div className="grid grid-cols-8 gap-x-2 gap-y-2">
          {character.items.concat([...Array(itemSlots - character.items.length)]).map((x, idx) => {
            return <ItemSlot key={x?.id ?? idx - itemSlots} item={x} small />
          })}
        </div>
        <ItemSlot medium action={ItemAction.Delete}>
          <img className="absolute inset-0 p-1 mx-auto w-full h-full" src="svg/iconTrash.svg" alt="delete item" />
        </ItemSlot>
      </div>
    </div>
  </Window>
}

export default InventoryWindow;