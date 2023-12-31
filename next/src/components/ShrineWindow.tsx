import { ItemAction } from "@/models/ItemAction";
import { useWindow, UIShrineWindowState } from "./contexts/UIContext";
import { useCharacter } from "./contexts/UserContext";
import ItemSlot from "./ItemSlot";
import ProgressBar from "./ProgressBar";
import Window from "./Window";
import { UIWindow } from "@/models/UIWindow";

export default function ShrineWindow() {
  const { closeWindow, windowState, setWindowState } = useWindow<UIShrineWindowState>(UIWindow.Shrine);
  const { character, shrineItem } = useCharacter();

  const sacrifice = () => {
    if (!windowState?.shrineItem) return;
    if (shrineItem(windowState?.shrineItem)) {
      setWindowState({ ...windowState, shrineItem: undefined });
    }
  }

  return <Window className="!w-80" isVisible={windowState!.isVisible} close={closeWindow} coords={windowState!.coords} type={windowState!.type}>
    <Window.Title>Shrine</Window.Title>
    <div className="flex flex-col h-full relative">
      <div className="flex flex-col gap-y-3">
        <ProgressBar current={character.life} max={character.stats.maxLife!} color="red" />
        <ProgressBar current={character.mana} max={character.stats.maxMana!} color="blue" />
      </div>
      <img className="h-96 self-center bottom-1 absolute" src="svg/iconStatue.svg" alt="" />
      <div className="flex-grow flex flex-col gap-y-3 items-center place-content-end h-96 relative">
        <div className="text-center">Drag and drop the Item you wish to sacrifice to the box below.</div>
        <ItemSlot action={ItemAction.Shrine} item={windowState?.shrineItem} />
        <div>
          <button onClick={_ => sacrifice()} className="ignore-reorder">Sacrifice Item</button>
        </div>
      </div>
    </div>
  </Window>
}