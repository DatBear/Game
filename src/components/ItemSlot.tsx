import Item, { itemIcons, itemTiers } from "@/models/Item";
import clsx from "clsx";

type ItemProps = {
  item?: Item;
  small?: boolean;
} & React.PropsWithChildren & Partial<React.HTMLAttributes<HTMLDivElement>>;

export default function ItemSlot({ item, small, children, className }: ItemProps) {
  let sizeClass = small ? "w-6 h-6" : "w-16 h-16";
  return (<div className={clsx("item", className, sizeClass, "flex-none border relative bg-stone-900")}>
    <>
      {children}
      {item && <>
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