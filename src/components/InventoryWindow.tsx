import gs from '@/styles/game.module.css'
import Window from "./Window";

function InventoryWindow() {
  return (<>
    <Window>
      <Window.Title>
        {/* <div className="flex-grow text-center">
          <span className="border px-2 py-1 bg-stone-900">Inventory</span>
        </div> */}
        Inventory
      </Window.Title>


      <div>
        <div className="flex flex-row gap-7">
          <div className="flex flex-col items-center">
            <span className="block text-center">Weapon</span>
            <div className={gs.item}>
              <img src="svg/iconClub.svg" />
              <span className={gs.magicLevel}>+1</span>
              <span className={gs.tier}>III</span>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <span className="block text-center">Armor</span>
            <div className={gs.item}>
              <img src="svg/iconRobe.svg" />
              <span className={gs.magicLevel}>+1</span>
              <span className={gs.tier}>III</span>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <span className="block text-center">Charm</span>
            <div className={gs.item}>
              <img src="svg/iconFireCharm.svg" />
              <span className={gs.magicLevel}>+1</span>
              <span className={gs.tier}>III</span>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <span className="block text-center">Acc.&nbsp;Charm</span>
            <div className={gs.item}>
              <img src="svg/iconFireCharm.svg" />
              <span className={gs.magicLevel}>+1</span>
              <span className={gs.tier}>III</span>
            </div>
          </div>
        </div>
      </div>
      <div>
        <span>Equipment (3/10)</span>
        <div className="grid grid-cols-5 gap-x-2 gap-y-3">
          <div className={gs.item}>
            <img src="svg/iconFireCharm.svg" />
            <span className={gs.magicLevel}>+1</span>
            <span className={gs.tier}>III</span>
          </div>
          <div className={gs.item}>
            <img src="svg/iconRobe.svg" />
            <span className={gs.magicLevel}>+1</span>
            <span className={gs.tier}>III</span>
          </div>
          <div className={gs.item}>
            <img src="svg/iconPaddedRobe.svg" />
            <span className={gs.magicLevel}>+1</span>
            <span className={gs.tier}>IV</span>
          </div>
          <div className={gs.item}></div>
          <div className={gs.item}></div>
          <div className={gs.item}></div>
          <div className={gs.item}></div>
          <div className={gs.item}></div>
          <div className={gs.item}></div>
          <div className={gs.item}></div>
          <div className={gs.item}></div>
          <div className={gs.item}></div>
          <div className={gs.item}></div>
        </div>
      </div>
      <div>
        <span>Items</span>
        <div className="flex flex-wrap place-content-center gap-x-2 gap-y-3">
          <div className="grid grid-cols-8 gap-x-2 gap-y-2">
            <div className={gs.smallItem}>
              <img src="svg/iconFish.svg" />
              <span className={gs.quantity}>12</span>
            </div>
            <div className={gs.smallItem}>
              <img src="svg/iconFish.svg" />
              <span className={gs.quantity}>1</span>
            </div>
            <div className={gs.smallItem}>
              <img src="svg/iconFish.svg" />
              <span className={gs.quantity}>20</span>
            </div>
            <div className={gs.smallItem}></div>
            <div className={gs.smallItem}></div>
            <div className={gs.smallItem}></div>
            <div className={gs.smallItem}></div>
            <div className={gs.smallItem}></div>
            <div className={gs.smallItem}></div>
            <div className={gs.smallItem}></div>
            <div className={gs.smallItem}></div>
            <div className={gs.smallItem}></div>
            <div className={gs.smallItem}></div>
            <div className={gs.smallItem}></div>
            <div className={gs.smallItem}></div>
            <div className={gs.smallItem}></div>
          </div>
        </div>
      </div>
    </Window>
  </>);
}

export default InventoryWindow;