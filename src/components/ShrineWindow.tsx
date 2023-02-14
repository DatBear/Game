import gs from '@/styles/game.module.css'
import ItemSlot from "./ItemSlot";
import ProgressBar from "./ProgressBar";
import Window from "./Window";

export default function ShrineWindow() {
  return <Window className="!w-80">
    <Window.Title>Shrine</Window.Title>
    <div className="flex flex-col h-full relative">
      <div className="flex flex-col gap-y-3">
        <ProgressBar current={36} max={40} color="red" />
        <ProgressBar current={90} max={120} color="blue" />
      </div>
      <img className="h-96 self-center bottom-1 absolute" src="svg/iconStatue.svg" />
      <div className="flex-grow flex flex-col gap-y-3 items-center place-content-end h-96 relative">
        <div className="text-center">Drag and drop the Item you wish to sacrifice to the box below.</div>
        <ItemSlot />
        <div>
          <button className="bg-stone-900 px-3 py-1 border w-full">Sacrifice Item</button>
        </div>
      </div>
    </div>
  </Window>
}