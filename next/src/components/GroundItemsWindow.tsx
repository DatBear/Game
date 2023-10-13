import { useEffect, useRef, useState } from "react";
import { useUser } from "./contexts/UserContext";
import { UIWindow, UIWindowState, useWindow } from "./contexts/UIContext";
import Window from "./Window";
import { listen } from "@/network/Socket";
import ResponsePacketType from "@/network/ResponsePacketType";
import { GroundItem } from "@/models/GroundItem";
import ItemSlot from "./ItemSlot";
import { Zone } from "@/models/Zone";
import clsx from "clsx";
import { ItemAction } from "@/models/ItemAction";



export default function GroundItemsWindow() {
  const { user } = useUser();
  const { closeWindow, windowState, setWindowState } = useWindow<UIWindowState>(UIWindow.GroundItems);
  const [groundItems, setGroundItems] = useState<GroundItem[]>([]);

  useEffect(() => {
    let timer = setInterval(() => {
      if (groundItems.length > 0) {
        setGroundItems(x => [...x.filter(x => x.expiresTimestamp > new Date().getTime() && (!x.hasUserClicked || user.group))]);
      }
    }, 100);
    return () => clearInterval(timer);
  }, [groundItems]);

  useEffect(() => {
    if (!user.selectedCharacter || user.selectedCharacter.zone != Zone.Catacombs) {
      setWindowState({ isVisible: false });
    } else {
      if (groundItems.length > 0) {
        setWindowState({ isVisible: true });
      }
    }
  }, [user]);

  useEffect(() => {
    return listen(ResponsePacketType.AddGroundItem, (e: GroundItem) => {
      if (user.selectedCharacter?.zone == Zone.Catacombs) {
        setWindowState({ isVisible: true });
      }
      setGroundItems([...groundItems, e]);
    }, true);
  }, [setWindowState, groundItems, setGroundItems]);

  useEffect(() => {
    return listen(ResponsePacketType.UpdateGroundItem, (e: GroundItem) => {
      setGroundItems([...groundItems.filter(x => x.item.id != e.item.id), e]);
    }, true);
  }, [groundItems, setGroundItems]);

  return <Window className="" isVisible={windowState!.isVisible} close={() => closeWindow()}>
    <Window.Title>Drops</Window.Title>
    <div className="flex flex-row gap-x-1 h-16 w-[40rem] overflow-y-auto wrap">
      {groundItems.map(x => {
        var remainingDuration = Math.max(0, Math.round((x.expiresTimestamp - new Date().getTime()) / 100) / 10);
        return <ItemSlot key={x.item.id} item={x.item} action={ItemAction.PickUp} noDrag className={clsx("groundItem", x.hasGroupClicked && "groupClicked", x.hasUserClicked && "userClicked")}>
          <div className="w-full h-full flex justify-around">
            <p className="self-center">{remainingDuration}s</p>
          </div>
        </ItemSlot>
      })}
    </div>
  </Window>
}