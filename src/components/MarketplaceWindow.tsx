import gs from '@/styles/game.module.css'
import { Tab } from '@headlessui/react'
import { Fragment, useCallback, useEffect } from 'react';
import Window from '@/components/Window';
import Item, { ItemSubType } from "@/models/Item";
import MarketItem from "@/models/MarketItem";
import ItemSlot from "./ItemSlot";
import { useWindow, UIWindow } from "./contexts/UIContext";


let marketItems: MarketItem[] = [
  { price: 100, item: { subType: ItemSubType.Club, stats: Array(1), tier: 3 } },
  { price: 110, item: { subType: ItemSubType.PaddedRobe, stats: Array(1), tier: 3 } },
  { price: 120, item: { subType: ItemSubType.Fire, stats: Array(1), tier: 3 } },
  { price: 130, item: { subType: ItemSubType.Fire, stats: Array(1), tier: 3 } },
  { price: 140, item: { subType: ItemSubType.Fish, stats: Array(1), tier: 3, quantity: 12 } },
  { price: 150, item: { subType: ItemSubType.Fish, stats: Array(1), tier: 3, quantity: 1 } },
  { price: 160, item: { subType: ItemSubType.Fish, stats: Array(1), tier: 3, quantity: 20 } },
];

let buyItem: MarketItem = marketItems[0];
let sellItem: Item = marketItems[1].item;
let transferItem: Item = marketItems[2].item;

function MarketItemSlot({ marketItem }: { marketItem: MarketItem }) {
  return (<div className="flex flex-col w-16">
    <ItemSlot item={marketItem.item} />
    <div className="flex flex-row bg-stone-500/50 items-center w-16">
      <span className="flex-grow text-right px-1">{marketItem.price}</span>
      <img src="svg/iconGold.svg" />
    </div>
  </div>)
}

export default function MarketplaceWindow() {
  const { closeWindow } = useWindow(UIWindow.Marketplace);

  return <Window tabbed close={() => closeWindow()}>
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
            <button className="mx-auto">Search</button>
          </form>

          <div className="flex flex-col flex-grow text-sm gap-y-4 basis-full sm:basis-8/12 w-min">
            <div className="flex-grow grid grid-cols-5 gap-x-4 gap-y-3 overflow-y-auto sm:h-1 px-3 place-content-start">
              {marketItems.map((x, idx) => {
                return <MarketItemSlot key={idx} marketItem={x} />
              })}
            </div>
            <div className="flex flex-row items-center justify-end">
              <div className="px-4">
                <MarketItemSlot marketItem={buyItem} />
              </div>
              <div className="flex flex-col gap-y-4">
                <input placeholder="Gold Password" type="password" />
                <button>Buy this item</button>
              </div>
            </div>
          </div>
        </div>
      </Window.TabPanel>
      <Window.TabPanel>
        <div id="sellItems" className="flex flex-col sm:flex-row pt-4 gap-4 h-96 sm:w-[40rem]">
          <div className="basis-1/5 flex flex-row sm:flex-col gap-5 justify-center sm:justify-start items-center">
            <ItemSlot className="flex justify-center place-items-center">
              <span className="text-2xl">?</span>
            </ItemSlot>
            <ItemSlot>
              <img className="absolute inset-0 p-1 mx-auto w-full h-full" src="svg/iconTrash.svg" />
            </ItemSlot>
          </div>
          <div className="basis-4/5 flex flex-col gap-y-4">
            <div className="flex-grow border p-4">No items found.</div>
            <div className="flex flex-row items-center justify-end">
              <div className="px-4">
                <ItemSlot item={sellItem} />
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
                <button>Sell this item</button>
              </div>
            </div>
          </div>
        </div>
      </Window.TabPanel>
      <Window.TabPanel>
        <div id="transfer" className="flex flex-col sm:flex-row pt-4 gap-4 h-96 sm:w-[40rem]">
          <div className="basis-1/5 flex flex-row sm:flex-col gap-5 justify-center sm:justify-start items-center">
            <ItemSlot className="flex justify-center place-items-center">
              <span className="text-2xl">?</span>
            </ItemSlot>
          </div>
          <div className="basis-4/5 flex flex-col gap-y-4">
            <div className="flex-grow border p-4">No characters found.</div>
            <div className="flex flex-row items-center justify-end">
              <div className="px-4">
                <ItemSlot item={transferItem} />
              </div>
              <div>
                <button >Transfer Item</button>
              </div>
            </div>
          </div>
        </div>
      </Window.TabPanel>
    </Window.TabPanels>
  </Window>;
}