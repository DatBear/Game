import gs from '@/styles/game.module.css'
import { Tab } from '@headlessui/react'
import { Fragment, useEffect } from 'react';
import Window from '@/components/Window';

export default function MarketplaceWindow() {
  return (<>
    <Window tabbed>
      <Window.Title>
        <Window.TabList>
          <Window.Tab>Market Search</Window.Tab>
          <Window.Tab>Sell Items</Window.Tab>
          <Window.Tab>Transfer</Window.Tab>
        </Window.TabList>
      </Window.Title>
      <Window.TabPanels>
        <Window.TabPanel>
          <div id="marketSearch" className="flex flex-row flex-wrap sm:flex-nowrap pt-4 gap-4 sm:w-[40rem]">
            <form className="flex flex-col text-center gap-y-2 basis-full sm:basis-4/12 text-xs">
              <span className="">Type:</span>
              <select>
                <option>Weapons</option>
              </select>
              <select>
                <option>Sub Type</option>
              </select>
              <span>Level Range:</span>
              <div className="flex flex-row gap-x-2 items-center">
                <select>
                  <option></option>
                </select>
                <span>to</span>
                <select>
                  <option></option>
                </select>
              </div>
              <span>Magic Level:</span>
              <div className="flex flex-row gap-x-2 items-center">
                <select>
                  <option></option>
                </select>
                <span>to</span>
                <select>
                  <option></option>
                </select>
              </div>
              <span>Cost Range:</span>
              <div className="flex flex-row gap-x-2 items-center">
                <input />
                <span>to</span>
                <input />
              </div>
              <div className="flex flex-row">
                <span className="w-3/4 text-left px-4">Attributes:</span>
                <span className="w-1/4 text-left">Min</span>
              </div>
              <div className="flex flex-row">
                <div className="w-3/4 flex-none text-left">
                  <select className="w-11/12">
                    <option></option>
                  </select>
                </div>
                <div className="w-1/4 flex-none">
                  <input />
                </div>
              </div>
              <div className="flex flex-row">
                <div className="w-3/4 flex-none text-left">
                  <select className="w-11/12">
                    <option></option>
                  </select>
                </div>
                <div className="w-1/4 flex-none">
                  <input />
                </div>
              </div>
              <div className="flex flex-row">
                <div className="w-3/4 flex-none text-left">
                  <select className="w-11/12">
                    <option></option>
                  </select>
                </div>
                <div className="w-1/4 flex-none">
                  <input />
                </div>
              </div>
              <div>
                <label>
                  <input type="checkbox" defaultChecked /> Only show items I can use
                </label>
              </div>
              <button className="bg-stone-900 px-10 py-1 inline mx-auto border">Search</button>
            </form>

            <div className="flex flex-col flex-grow text-sm gap-y-4 basis-full sm:basis-8/12 w-min">
              <div className="flex-grow grid grid-cols-5 gap-x-4 gap-y-3 overflow-y-auto sm:h-1 px-3">
                <div className={gs.marketItem}>
                  <div className={gs.item}>
                    <img src="svg/iconFireCharm.svg" />
                    <span className={gs.magicLevel}>+1</span>
                    <span className={gs.tier}>III</span>
                  </div>
                  <div className={gs.price}>
                    <span>100</span>
                    <img src="svg/iconGold.svg" />
                  </div>
                </div>

                <div className={gs.marketItem}>
                  <div className={gs.item}>
                    <img src="svg/iconPaddedRobe.svg" />
                    <span className={gs.magicLevel}>+1</span>
                    <span className={gs.tier}>IV</span>
                  </div>
                  <div className={gs.price}>
                    <span>110</span>
                    <img src="svg/iconGold.svg" />
                  </div>
                </div>

                <div className={gs.marketItem}>
                  <div className={gs.item}>
                    <img src="svg/iconPaddedRobe.svg" />
                    <span className={gs.magicLevel}>+1</span>
                    <span className={gs.tier}>V</span>
                  </div>
                  <div className={gs.price}>
                    <span>120</span>
                    <img src="svg/iconGold.svg" />
                  </div>
                </div>

              </div>
              <div className="flex flex-row items-center justify-end">
                <div className="px-4">
                  <div className={gs.marketItem}>
                    <div className={gs.item}>
                      <img src="svg/iconPaddedRobe.svg" />
                      <span className={gs.magicLevel}>+2</span>
                      <span className={gs.tier}>IV</span>
                    </div>
                    <div className={gs.price}>
                      <span>110</span>
                      <img src="svg/iconGold.svg" />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-y-4">
                  <input placeholder="Gold Password" type="password" />
                  <button className="bg-stone-900 px-10 py-1 inline w-full mx-auto border">Buy this item</button>
                </div>
              </div>
            </div>
          </div>
        </Window.TabPanel>
        <Window.TabPanel>
          <div id="sellItems" className="flex flex-col sm:flex-row pt-4 gap-4 h-96 sm:w-[40rem]">
            <div className="basis-1/5 flex flex-row sm:flex-col gap-5 justify-center sm:justify-start items-center">
              <div className={`${gs.item} flex justify-center place-items-center`}>
                <span className="text-2xl">?</span>
              </div>
              <div className={gs.item}><img src="svg/iconTrash.svg" /></div>
            </div>
            <div className="basis-4/5 flex flex-col gap-y-4">
              <div className="flex-grow border p-4">No items found.</div>
              <div className="flex flex-row items-center justify-end">
                <div className="px-4">
                  <div className={gs.item}>
                    <img src="svg/iconPaddedRobe.svg" />
                    <span className={gs.magicLevel}>+2</span>
                    <span className={gs.tier}>IV</span>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <label className="flex flex-row">
                    <span className="w-1/4">Cost:</span>
                    <div className="w-3/5"><input /></div>
                  </label>
                  <label className="flex flex-row">
                    <span className="w-1/4">Fee:</span>
                    <div className="w-3/5"><input disabled={true} defaultValue="100" /></div>
                  </label>
                </div>
                <div className="flex flex-col gap-y-4">
                  <input placeholder="Gold Password" type="password" />
                  <button className="bg-stone-900 w-full py-1 inline mx-auto border">Sell this item</button>
                </div>
              </div>
            </div>
          </div>
        </Window.TabPanel>
        <Window.TabPanel>
          <div id="transfer" className="flex flex-col sm:flex-row pt-4 gap-4 h-96 sm:w-[40rem]">
            <div className="basis-1/5 flex flex-row sm:flex-col gap-5 justify-center sm:justify-start items-center">
              <div className={`${gs.item} flex justify-center place-items-center`}>
                <span className="text-2xl">?</span>
              </div>
            </div>
            <div className="basis-4/5 flex flex-col gap-y-4">
              <div className="flex-grow border p-4">No characters found.</div>
              <div className="flex flex-row items-center justify-end">
                <div className="px-4">
                  <div className={gs.item}>
                    <img src="svg/iconPaddedRobe.svg" />
                    <span className={gs.magicLevel}>+2</span>
                    <span className={gs.tier}>IV</span>
                  </div>
                </div>
                <div>
                  <button className="bg-stone-900 w-full py-1 px-10 inline mx-auto border">Transfer Item</button>
                </div>
              </div>
            </div>
          </div>
        </Window.TabPanel>
      </Window.TabPanels>
    </Window>
  </>);
}