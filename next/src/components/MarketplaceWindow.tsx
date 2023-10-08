import Window from '@/components/Window';
import Item, { ItemSubType } from "@/models/Item";
import MarketItem from "@/models/MarketItem";
import ItemSlot from "./ItemSlot";
import { useWindow, UIWindow, UIMarketplaceWindowState } from "./contexts/UIContext";
import { v4 as uuid } from "uuid";
import { ItemAction } from "@/models/ItemAction";
import { useEffect, useState } from "react";
import { useCharacter, useUser } from "./contexts/UserContext";
import Character from "@/models/Character";
import clsx from "clsx";
import { CharacterStats } from "@/models/Stats";


const marketItems: MarketItem[] = [
  { price: 100, item: { id: uuid(), subType: ItemSubType.Club, stats: { [CharacterStats.Strength]: 1 }, tier: 4 } },
  { price: 110, item: { id: uuid(), subType: ItemSubType.PaddedRobe, stats: { [CharacterStats.CriticalFlux]: 1 }, tier: 2 } },
  { price: 120, item: { id: uuid(), subType: ItemSubType.Fire, stats: { [CharacterStats.DamageReturn]: 3 }, tier: 3 } },
  { price: 130, item: { id: uuid(), subType: ItemSubType.Fire, stats: { [CharacterStats.ArmorPierce]: 1 }, tier: 1 } },
  { price: 140, item: { id: uuid(), subType: ItemSubType.Fish, stats: { [CharacterStats.MaxLife]: 19 }, tier: 1, quantity: 12 } },
  { price: 150, item: { id: uuid(), subType: ItemSubType.Fish, stats: { [CharacterStats.MaxLife]: 100 }, tier: 2, quantity: 1 } },
  { price: 160, item: { id: uuid(), subType: ItemSubType.Fish, stats: { [CharacterStats.MaxLife]: 130, [CharacterStats.MaxMana]: 100 }, tier: 3, quantity: 20 } },
];

function MarketItemSlot({ marketItem, action }: { marketItem?: MarketItem, action?: ItemAction }) {
  return (<div className="flex flex-col w-16">
    <ItemSlot item={marketItem?.item} action={action} />
    {marketItem && <div className="flex flex-row bg-stone-500/50 items-center w-16">
      <span className="flex-grow text-right px-1">{marketItem.price}</span>
      <img src="svg/iconGold.svg" alt="gold" />
    </div>}
  </div>)
}

function CharacterSlot({ character, isSelected, onClick }: { character: Character, isSelected: boolean, onClick: () => void }) {
  const classes = clsx("flex flex-row border p-1", isSelected ? "bg-stone-700" : "bg-stone-800");
  return <div className={classes} onClick={_ => onClick()}>
    <div>{character.name} (Lv. {character.level} {character.class})</div>
  </div>
}

type BuyTabState = {

}

type SellTabState = {
  cost: number;
  fee: number;
  goldPassword: string;
}

type TransferTabState = {
  selectedCharacter?: Character;
}

export default function MarketplaceWindow() {
  const { user, listMarketItem, transferItem } = useUser();
  const { character, buyMarketItem } = useCharacter();
  const { closeWindow, windowState, setWindowState } = useWindow<UIMarketplaceWindowState>(UIWindow.Marketplace);
  const [buyTabState, setBuyTabState] = useState({ searchResults: windowState?.searchResults } as BuyTabState);
  const [sellTabState, setSellTabState] = useState({} as SellTabState);
  const [transferTabState, setTransferTabState] = useState({} as TransferTabState);


  useEffect(() => {
    setWindowState({ ...windowState, isVisible: windowState?.isVisible ?? false, searchResults: marketItems });
  }, []);

  const search = () => {

  }

  const buyItem = () => {
    if (!windowState?.buyItem) return;
    var item = windowState.buyItem;
    if (buyMarketItem(item)) {
      //sound?
    }
  }

  const updateCost = (cost: string) => {
    const costFloat = parseFloat(cost);
    const fee = costFloat < 20 ? 0 : costFloat * 5 / 100
    setSellTabState(s => ({ ...s, cost: costFloat, fee }));
  }

  const sellItem = () => {
    if (!windowState?.sellItem) return;
    //todo check gold password, subtract fee
    const marketItem: MarketItem = {
      item: windowState?.sellItem,
      price: sellTabState.cost
    };
    if (listMarketItem(marketItem)) {
      setSellTabState({} as SellTabState);
      setWindowState({ ...windowState, sellItem: undefined })
    }
  }

  const selectCharacter = (char: Character) => {
    setTransferTabState({ ...transferTabState, selectedCharacter: char });
  }

  const transfer = () => {
    if (!windowState?.transferItem) return;
    if (!transferTabState.selectedCharacter) return;
    if (transferItem(windowState.transferItem, transferTabState.selectedCharacter)) {
      setWindowState({ ...windowState, transferItem: undefined });
    }
  }

  return <Window tabbed isVisible={windowState!.isVisible} close={() => closeWindow()}>
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
            <button className="mx-auto" onClick={_ => search()}>Search</button>
          </form>

          <div className="flex flex-col flex-grow text-sm gap-y-4 basis-full sm:basis-8/12 w-min">
            <div className="flex-grow grid grid-cols-5 gap-x-4 gap-y-3 overflow-y-auto sm:h-1 px-3 place-content-start">
              {windowState?.searchResults.length === 0 && <span className="w-max p-1">No items found.</span>}
              {windowState?.searchResults.map((x, idx) => {
                return <MarketItemSlot key={x.item.id ?? idx} marketItem={x} action={ItemAction.Buy} />
              })}
            </div>
            <div className="flex flex-row items-center justify-end">
              <div className="px-4">
                <MarketItemSlot marketItem={windowState?.buyItem} action={ItemAction.Buy} />
              </div>
              <div className="flex flex-col gap-y-4">
                <input placeholder="Gold Password" type="password" />
                <button onClick={_ => buyItem()}>Buy this item</button>
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
            <div className="flex-grow border p-1">
              {user.marketItems.length > 0 && <div className="grid grid-cols-6">
                {user.marketItems.map(x => <MarketItemSlot key={x.item.id} marketItem={x} />)}
              </div>}
              {user.marketItems.length === 0 && <span className="p-3">No items found.</span>}
            </div>
            <div className="flex flex-row items-center justify-end">
              <div className="px-4">
                <ItemSlot item={windowState?.sellItem} action={ItemAction.Sell} />
              </div>
              <div className="flex flex-col gap-4">
                <label className="flex flex-row">
                  <span className="w-1/4">Cost:</span>
                  <div className="w-3/5"><input value={(isNaN(sellTabState.cost) ? '' : sellTabState.cost) ?? ''} onChange={e => updateCost(e.target.value)} /></div>
                </label>
                <label className="flex flex-row">
                  <span className="w-1/4">Fee:</span>
                  <div className="w-3/5"><input disabled={true} value={(isNaN(sellTabState.fee) ? 0 : sellTabState.fee) ?? 0} /></div>
                </label>
              </div>
              <div className="flex flex-col gap-y-4">
                <input value={sellTabState.goldPassword ?? ''} onChange={e => setSellTabState({ ...sellTabState, goldPassword: e.target.value })} placeholder="Gold Password" type="password" />
                <button onClick={_ => sellItem()}>Sell this item</button>
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
            <div className="flex-grow border flex flex-col p-2 gap-y-2">
              {user.characters.length === 1 && <span className="p-3">No characters found.</span>}
              {user.characters.filter(x => x.id !== character.id).map(x => <CharacterSlot key={x.id} character={x} isSelected={transferTabState.selectedCharacter?.id == x.id} onClick={() => selectCharacter(x)} />)}
            </div>
            <div className="flex flex-row items-center justify-end">
              <div className="px-4">
                <ItemSlot item={windowState?.transferItem} action={ItemAction.Transfer} />
              </div>
              <div>
                <button onClick={() => transfer()}>Transfer Item</button>
              </div>
            </div>
          </div>
        </div>
      </Window.TabPanel>
    </Window.TabPanels>
  </Window>;
}