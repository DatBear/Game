import { useEffect, useRef, useState } from "react";
import { useUser } from "./contexts/UserContext";
import { UIWindowState, useWindow } from "./contexts/UIContext";
import Window from "./Window";
import { listen } from "@/network/Socket";
import ResponsePacketType from "@/network/ResponsePacketType";
import { GroundItem } from "@/models/GroundItem";
import ItemSlot from "./ItemSlot";
import { Zone } from "@/models/Zone";
import clsx from "clsx";
import { ItemAction } from "@/models/ItemAction";
import { UIWindow } from "@/models/UIWindow";

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
      if (!windowState?.isVisible) return;
      setWindowState({ ...windowState!, isVisible: false });
    } else {
      if (groundItems.length > 0 && !windowState?.isVisible) {
        setWindowState({ ...windowState!, isVisible: true });
      }
    }
  }, [user, setWindowState]);

  useEffect(() => {
    return listen(ResponsePacketType.AddGroundItem, (e: GroundItem) => {
      if (user.selectedCharacter?.zone == Zone.Catacombs && !windowState?.isVisible) {
        setWindowState({ ...windowState!, isVisible: true });
      }
      setGroundItems([...groundItems, e]);
    });
  }, [groundItems, setGroundItems, setWindowState]);

  useEffect(() => {
    return listen(ResponsePacketType.UpdateGroundItem, (e: GroundItem) => {
      setGroundItems([...groundItems.filter(x => x.item.id != e.item.id), e]);
    });
  }, [groundItems, setGroundItems]);

  return <Window isVisible={windowState!.isVisible} close={closeWindow} coords={windowState!.coords} type={windowState!.type}>
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