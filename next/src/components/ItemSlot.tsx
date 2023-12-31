import Item, { itemIcons, itemTiers, ItemSubType, ItemType, getItemType, itemMagicPrefixes, itemNames, getItemName } from "@/models/Item";
import { ItemAction } from "@/models/ItemAction";
import { SkillType } from "@/models/Skill";
import clsx from "clsx";
import { useId, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { useCharacter } from "./contexts/UserContext";
import { Tooltip } from "react-tooltip"
import { itemSpecificStatNames, statNames } from "@/models/Stats";
import calculatedItemStats from "@/models/CalculatedItemStat";
import { recordKeys } from "@/utils/RecordUtils";
import { EquippedItemSlot } from "@/models/EquippedItem";
import RequestPacketType from "@/network/RequestPacketType";
import { send } from "@/network/Socket";

const dragType = "Item";

type ItemProps = {
  item?: Item;
  small?: boolean;
  medium?: boolean;
  slot?: EquippedItemSlot;
  action?: ItemAction;
  skill?: SkillType;
  acceptTypes?: ItemType[];
  acceptSubTypes?: ItemSubType[];
  acceptMaxTier?: number;
  noDrag?: boolean;
  noTooltip?: boolean;
  hotkey?: string;
  borderless?: boolean;
  noBackground?: boolean;
} & React.PropsWithChildren & Partial<React.HTMLAttributes<HTMLDivElement>>;

type DragObject = {
  item: Item;
  slot?: EquippedItemSlot;
};

const typeSlots: Partial<Record<ItemType, EquippedItemSlot>> = {
  [ItemType.Weapon]: EquippedItemSlot.Weapon,
  [ItemType.Armor]: EquippedItemSlot.Armor,
  [ItemType.Charm]: EquippedItemSlot.Charm,
}

export default function ItemSlot({ item, small, medium, acceptTypes, acceptSubTypes, acceptMaxTier, slot, action: action, skill, noDrag, noTooltip, hotkey, borderless, noBackground, children, className, ...props }: ItemProps) {
  const type = item && getItemType(item.subType);
  const iconPath = !item ? '' : `svg/${itemIcons[item.subType].replaceAll(' ', '')}.svg`;

  const ref = useRef(null);
  const id = useId().replaceAll(':', '');
  const { character,
    canEquipItem, equipItem,
    canUnequipItem, unequipItem,
    canDoItemAction, doItemAction
  } = useCharacter();

  const onClick = () => {
    if ((noDrag ?? false) && item && action) {
      if (canDoItemAction(item, action, skill)) {
        doItemAction(item, action, skill);
      }
    }
  };

  const [{ canDrop, isOver }, drop] = useDrop({
    accept: dragType,
    canDrop(dragging, monitor) {
      const { item: draggedItem, slot: draggedSlot } = dragging as DragObject;
      if (slot != null && item != null && draggedSlot == null) {
        return canEquipItem(draggedItem, slot!);
      }
      if (slot == null && draggedSlot != null && draggedItem != null && action == null) {
        return canUnequipItem();
      }
      if (action != null && draggedItem != null) {
        //console.log('action', canDoItemAction(draggedItem, action));
        return canDoItemAction(draggedItem, action, skill);
      }

      let canDrop = draggedItem != null;
      if (canDrop && (acceptTypes?.length ?? 0) > 0) {
        let draggedType = getItemType(draggedItem.subType);
        let canDropType = acceptTypes!.find(x => x === draggedType) !== undefined;
        canDrop &&= canDropType;
      }
      if (canDrop && (acceptSubTypes?.length ?? 0) > 0) {
        let canDropSubType = acceptSubTypes!.find(x => x == draggedItem.subType) !== undefined;
        canDrop &&= canDropSubType;
      }
      if (canDrop && (acceptMaxTier ?? -1) >= 0) {
        let canDropTier = acceptMaxTier! >= draggedItem.tier;
        canDrop &&= canDropTier;
      }
      return canDrop;
    },
    drop(dragging, monitor) {
      const { item: draggedItem, slot: draggedSlot } = dragging as DragObject;
      //console.log('drop: item', draggedItem, 'slot', draggedSlot, 'slot', slot);
      if (slot != null && draggedSlot == null && draggedItem != null) {
        return equipItem(draggedItem, slot);
      }
      if (slot == null && draggedSlot != null && draggedItem != null && action == ItemAction.Swap) {
        if (unequipItem(draggedSlot)) {
          return;
        }
      }
      if (action != null && draggedItem != null) {
        //todo figure out why the find is needed after stacking an item to show the correct quantity
        return doItemAction(character.items.find(x => x.id === draggedItem.id) ?? draggedItem, action, skill);
      }
      if (item && item.quantity && draggedItem.quantity) {
        send(RequestPacketType.StackItem, { itemId: item.id, draggedItemId: draggedItem.id })
      }
    },
    collect(monitor) {
      return {
        canDrop: monitor.canDrop(),
        isOver: monitor.isOver() && (monitor.getItem() as DragObject)?.item?.id != item?.id,
      }
    },
  });

  const [{ isDragging }, drag] = useDrag(() => ({
    type: dragType,
    item: { item, slot },
    collect: (monitor) => {
      return {
        isDragging: monitor.isDragging()
      };
    },
  }));

  if (item && !(noDrag ?? false)) {
    drag(drop(ref));
  } else {
    drop(ref);
  }

  let sizeClass = small ? "w-6 h-6" : medium ? "w-10 h-10" : "w-16 h-16";
  let equippableClass = !(noBackground ?? false) && item && type !== undefined && character && !slot && !isDragging
    && [ItemType.Weapon, ItemType.Armor, ItemType.Charm].indexOf(type) > -1
    && !canEquipItem(item, typeSlots[getItemType(item.subType)]!)
    ? "bg-red-600/20"
    : "";

  let borderClass = (borderless ?? false) ? "" : "border";
  let bgClass = (noBackground ?? false) ? "" : equippableClass.length == 0 ? "bg-stone-900" : equippableClass;
  let dragClass = !(noDrag ?? false) && isDragging ? '!border-green-500/25' : '';
  let dropClass = '';
  if (isOver && !(noDrag ?? false)) {
    if (acceptTypes != null || acceptSubTypes != null || acceptMaxTier != null || slot != null || action != null) {
      dropClass = canDrop ? '!bg-green-500/25' : '!bg-red-500/25';
    }
  }

  const numStats = item ? Object.keys(item.stats).length : 0;
  return (<>
    <div ref={ref} id={id} className={clsx("item", className, sizeClass, dragClass, dropClass, borderClass, bgClass, "flex-none relative", item?.subType === ItemSubType.FishingRod && "bg-stone-500")} onClick={onClick} {...props}>
      {item && !isDragging && <>
        <img src={iconPath} className="absolute inset-0 p-1 mx-auto w-full h-full" alt={itemNames[item.subType]} />
        {!small && !medium && <>
          {numStats > 0 && <span className="absolute top-0 left-0 px-1">+{numStats}</span>}
          {item.tier > 0 && <span className="absolute top-0 right-0 px-1">{itemTiers[item.tier]}</span>}
        </>}
        {item.quantity && <span className={clsx(small && "text-2xs", "absolute bottom-0 left-0 px-px")}>{item.quantity}</span>}
      </>}
      {hotkey && <span className="absolute top-0 left-0 px-1 text-sm">{hotkey}</span>}
      <div className="absolute inset-0">
        {children}
      </div>
    </div>
    {!noTooltip && item && item.tier > 0 && !isDragging && <Tooltip anchorSelect={`#${id}`} className="absolute item-tooltip" positionStrategy="fixed" delayShow={1} style={{ zIndex: 1 }}>
      <div className="flex flex-row gap-2">
        <div className="flex flex-col p-2 bg-stone-900 text-white relative border border-cyan-300">
          <div className="absolute flex justify-center items-center w-full h-full">
            <img src={iconPath} className="w-3/5 h-3/5 opacity-50" alt="" />
          </div>

          <div className="relative flex flex-col">
            <div className="w-max"><b>{getItemName(item)}</b></div>
            {calculatedItemStats.filter(x => x.hasStat(item, character)).map(x => <div key={x.name} className={clsx(x.class && x.class(item, character), "w-max")}>{x.name}: {x.value(item, character)}</div>)}
            {item.subType != ItemSubType.Essence && recordKeys(item.stats).map(k => {
              const statNamesRecord = type === ItemType.Item ? itemSpecificStatNames : statNames;
              const statName = statNamesRecord[k];
              if (!statName) {
                return null;
              }
              const value = Math.floor(item.stats[k]! / (item.quantity ?? 1)).toString() ?? '';
              const isReplace = statName.indexOf('{x}') > -1;
              const replaced = `${isReplace ? '' : '+'}${isReplace ? '' : value}${(statName.startsWith('%') ? '' : ' ')}${statName.replaceAll('{x}', value)}`
              return <div key={k} className="w-max">{replaced}</div>
            })}
            {item.quantity && <div>Quantity: {item.quantity}</div>}
          </div>

        </div>
      </div>
    </Tooltip>}
  </>)
}