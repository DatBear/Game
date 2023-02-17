import { EquippedItemSlot } from "@/models/EquippedItem";
import Item, { itemIcons, itemTiers, itemTypes, ItemSubType, ItemType, getItemType, canEquipItem } from "@/models/Item";
import { ItemAction } from "@/models/ItemAction";
import clsx from "clsx";
import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { useCharacter } from "./contexts/UserContext";

const type = "Item";



type ItemProps = {
  item?: Item;
  small?: boolean;
  slot?: EquippedItemSlot;
  action?: ItemAction;
  acceptTypes?: ItemType[];
  acceptSubTypes?: ItemSubType[];
  acceptMaxTier?: number;
  noDrag?: boolean;
  //todo add a source enum and acceptSource or something to give more drag+drop context
} & React.PropsWithChildren & Partial<React.HTMLAttributes<HTMLDivElement>>;

type DragObject = {
  item: Item;
  slot?: EquippedItemSlot;
};

export default function ItemSlot({ item, small, acceptTypes, acceptSubTypes, acceptMaxTier, slot, action, noDrag, children, className, ...props }: ItemProps) {
  const ref = useRef(null);
  const { character, hasSelectedCharacter,
    canEquipItem, equipItem,
    canUnequipItem, unequipItem,
    canDoItemAction, doItemAction
  } = useCharacter();

  const [{ canDrop, isOver }, drop] = useDrop({
    accept: type,
    canDrop(dragging, monitor) {
      const { item: draggedItem, slot: draggedSlot } = dragging as DragObject;
      if (slot != null && item != null && draggedSlot == null) {
        return canEquipItem(draggedItem, slot!);
      }
      if (slot == null && draggedSlot != null && draggedItem != null) {
        return canUnequipItem();
      }
      if (action != null && draggedItem != null) {
        return canDoItemAction(draggedItem, action);
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
      //console.log('drop: item', draggedItem, 'slot', draggedSlot);

      if (slot != null && draggedSlot == null && draggedItem != null) {
        return equipItem(draggedItem, slot);
      }
      if (slot == null && draggedSlot != null && draggedItem != null && action == null) {
        return unequipItem(draggedSlot);
      }
      if (action != null && draggedItem != null) {
        return doItemAction(draggedItem, action);
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
    type: type,
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



  let sizeClass = small ? "w-6 h-6" : "w-16 h-16";
  let dragClass = isDragging ? '!border-green-500/25' : '';
  let dropClass = '';
  if (isOver) {
    if (acceptTypes != null || acceptSubTypes != null || acceptMaxTier != null || slot != null || action != null) {
      dropClass = canDrop ? '!bg-green-500/25' : '!bg-red-500/25';
    }
  }

  let previewClass = clsx("!w-14 !h-14", isDragging ? 'inline' : 'hidden')
  return (<div ref={ref} className={clsx("item", className, sizeClass, dragClass, dropClass, "flex-none border relative bg-stone-900")} {...props}>
    <>
      {children}
      {item && !isDragging && <>
        <img src={`svg/${itemIcons[item.subType].replaceAll(' ', '')}.svg`} className="absolute inset-0 p-1 mx-auto w-full h-full" />
        {!small && <>
          {item.stats.length > 0 && <span className="absolute top-0 left-0 px-1">+{item.stats.length}</span>}
          {item.tier > 0 && <span className="absolute top-0 right-0 px-1">{itemTiers[item.tier]}</span>}
        </>}
        {item.quantity && <span className={clsx(small && "text-2xs", "absolute bottom-0 left-0 px-px")}>{item.quantity}</span>}
      </>}
    </>
  </div>)
}