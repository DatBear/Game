import Item, { itemIcons, itemTiers, itemTypes, ItemSubType, ItemType, getItemType } from "@/models/Item";
import clsx from "clsx";
import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";

const type = "Item";


type ItemProps = {
  item?: Item;
  small?: boolean;
  acceptTypes?: ItemType[];
  acceptSubTypes?: ItemSubType[];
  acceptMaxTier?: number;
  //todo add a source enum and acceptSource or something to give more drag+drop context
} & React.PropsWithChildren & Partial<React.HTMLAttributes<HTMLDivElement>>;

type DragObject = {
  subType: ItemSubType;
  tier: number;
};

export default function ItemSlot({ item, small, acceptTypes, acceptSubTypes, acceptMaxTier, children, className, ...props }: ItemProps) {
  let classes = className;
  const ref = useRef(null);
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: type,
    hover(draggedItem) {
    }, canDrop(draggedItem, monitor) {
      let canDrop = true;
      let dragObject = draggedItem as DragObject;
      if (canDrop && (acceptTypes?.length ?? 0) > 0) {
        let draggedType = getItemType(dragObject.subType);
        let canDropType = acceptTypes!.find(x => x === draggedType) !== undefined;
        //console.log('candrop', canDropType, 'dragType', draggedType, 'accepted', acceptTypes, typeof draggedType);
        canDrop &&= canDropType;
      }
      if (canDrop && (acceptSubTypes?.length ?? 0) > 0) {
        let canDropSubType = acceptSubTypes!.find(x => x == dragObject.subType) !== undefined;
        //console.log('candrop', canDropSubType, 'dragSubType', dragObject.subType);
        canDrop &&= canDropSubType;
      }
      if (canDrop && (acceptMaxTier ?? -1) >= 0) {
        let canDropTier = acceptMaxTier! >= dragObject.tier;
        //console.log('candrop', canDropTier, 'dragTier', dragObject.tier, 'max tier', acceptMaxTier);
        canDrop &&= canDropTier;
      }
      //console.log('canDrop', canDrop, draggedItem);
      return canDrop;
    },
    collect(monitor) {
      return {
        canDrop: monitor.canDrop(),
        isOver: monitor.isOver()
      }
    },
  });

  const [{ isDragging }, drag] = useDrag(() => ({
    type: type,
    item: { subType: item?.subType, tier: item?.tier },
    collect: (monitor) => {
      return {
        isDragging: monitor.isDragging()
      };
    },
  }));

  if (item) {
    drag(drop(ref));
  } else {
    drop(ref);
  }



  let sizeClass = small ? "w-6 h-6" : "w-16 h-16";
  let dragClass = isDragging ? '!border-green-500/25' : '';
  let dropClass = '';
  if (isOver) {
    if (acceptTypes != null || acceptSubTypes != null || acceptMaxTier != null) {
      dropClass = canDrop ? '!bg-green-500/25' : '!bg-red-500/25';
    }
  }

  let previewClass = clsx("!w-14 !h-14", isDragging ? 'inline' : 'hidden')
  return (<div ref={ref} className={clsx("item", className, sizeClass, dragClass, dropClass, "flex-none border relative bg-stone-900")} {...props}>
    <>
      {children}
      {item && !isDragging && <>
        <img src={`svg/${itemIcons[item.subType]}.svg`} className="absolute inset-0 p-1 mx-auto w-full h-full" />
        {!small && <>
          <span className="absolute top-0 left-0 px-1">+{item.stats.length}</span>
          <span className="absolute top-0 right-0 px-1">{itemTiers[item.tier]}</span>
        </>}
        {item.quantity && <span className={clsx(small && "text-2xs", "absolute bottom-0 left-0 px-px")}>{item.quantity}</span>}
      </>}
    </>
  </div>)
}