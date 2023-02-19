import CharacterImage from "../CharacterImage";
import { UIWindow, useUI, useWindow } from "../contexts/UIContext";
import { useCharacter, useUser } from "../contexts/UserContext";

export default function Town() {
  const { user, selectCharacter } = useUser();
  const { character } = useCharacter();
  const { setWindowState } = useUI();

  const showWindow = (window: UIWindow) => {
    setWindowState(window, { isVisible: true });
  }

  const goToCharacterSelect = () => {
    selectCharacter(null);
  }

  return <>
    {user.selectedCharacter && <div className="m-10 flex flex-col gap-5">
      <div className="flex flex-row gap-5">
        <button onClick={_ => showWindow(UIWindow.Inventory)}>Inventory</button>
        <button onClick={_ => showWindow(UIWindow.Groups)}>Groups</button>
        <button onClick={_ => showWindow(UIWindow.Stats)}>Stats</button>
        <button onClick={_ => goToCharacterSelect()}>Character Select</button>
      </div>

      <div>
        <div className="w-24 h-48"><CharacterImage character={character} /></div>
      </div>

      <div className="flex flex-row flex-wrap gap-x-4 gap-y-8 h-full w-full">
        <div className="w-36 h-36 flex flex-col items-center" onClick={_ => showWindow(UIWindow.Marketplace)}>
          <img src="svg/iconMarket.svg" className="w-full h-full" />
          <span className="text-xl">Marketplace</span>
        </div>
        <div className="w-36 h-36 flex flex-col items-center" onClick={_ => showWindow(UIWindow.Shrine)}>
          <img src="svg/iconShrine.svg" className="w-full h-full" />
          <span className="text-xl">Shrine</span>
        </div>
        <div className="w-36 h-36 flex flex-col items-center" onClick={_ => showWindow(UIWindow.Fishing)}>
          <img src="svg/iconLake.svg" className="w-full h-full" />
          <span className="text-xl">Fishing Pond</span>
        </div>
        <div className="w-36 h-36 flex flex-col items-center" onClick={_ => showWindow(UIWindow.Cooking)}>
          <img src="svg/iconKitchen.svg" className="w-full h-full" />
          <span className="text-xl">Cooking</span>
        </div>
        <div className="flex flex-col">
          <div className="flex flex-row">
            <div className="-mr-10" onClick={_ => showWindow(UIWindow.Transmuting)}><img src="svg/iconSkillLeft.svg" className="w-[10rem]" /></div>
            <div className="-mr-6" onClick={_ => showWindow(UIWindow.Glyphing)}><img src="svg/iconSkillCenter.svg" className="w-[6.3rem]" /></div>
            <div onClick={_ => showWindow(UIWindow.Suffusencing)}><img src="svg/iconSkillRight.svg" className="w-[10rem]" /></div>
          </div>
          <div className="flex flex-row gap-3">
            <div className="text-xl">Transmuting</div>
            <div className="text-xl">Glyphing</div>
            <div className="text-xl">Suffusencing</div>
          </div>
        </div>
      </div>
    </div>}
  </>;
}