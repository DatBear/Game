import Window from '@/components/Window';
import { ItemSubType, ItemType, itemMagicPrefixes, itemNames, itemTiers, itemTypes } from "@/models/Item";
import MarketItem from "@/models/MarketItem";
import ItemSlot from "./ItemSlot";
import { useWindow, UIMarketplaceWindowState } from "./contexts/UIContext";
import { ItemAction } from "@/models/ItemAction";
import { useEffect, useState } from "react";
import { useCharacter, useUser } from "./contexts/UserContext";
import Character from "@/models/Character";
import clsx from "clsx";
import { UIWindow } from "@/models/UIWindow";
import { ItemStats } from "@/models/Stats";
import { MarketSearchRequest } from "@/models/MarketSearchRequest";
import RequestPacketType from "@/network/RequestPacketType";
import { listen, send } from "@/network/Socket";
import ResponsePacketType from "@/network/ResponsePacketType";


const marketItems: MarketItem[] = [
  { id: 0, userId: 0, expiresAt: 0, isSold: false, price: 100, item: { id: 0, subType: ItemSubType.Club, stats: { strength: 1 }, tier: 4 } },
  { id: 0, userId: 0, expiresAt: 0, isSold: false, price: 110, item: { id: 1, subType: ItemSubType.PaddedRobe, stats: { criticalFlux: 1 }, tier: 2 } },
  { id: 0, userId: 0, expiresAt: 0, isSold: false, price: 120, item: { id: 2, subType: ItemSubType.Ice, stats: { damageReturn: 3 }, tier: 3 } },
  { id: 0, userId: 0, expiresAt: 0, isSold: false, price: 130, item: { id: 3, subType: ItemSubType.Fire, stats: { enhancedEffect: 36 }, tier: 3 } },
  { id: 0, userId: 0, expiresAt: 0, isSold: false, price: 140, item: { id: 4, subType: ItemSubType.Fish, stats: { maxLife: 19 }, tier: 1, quantity: 12 } },
  { id: 0, userId: 0, expiresAt: 0, isSold: false, price: 150, item: { id: 5, subType: ItemSubType.Fish, stats: { maxLife: 100 }, tier: 2, quantity: 1 } },
  { id: 0, userId: 0, expiresAt: 0, isSold: false, price: 160, item: { id: 6, subType: ItemSubType.Fish, stats: { maxLife: 130, maxMana: 100 }, tier: 3, quantity: 20 } },
  { id: 0, userId: 0, expiresAt: 0, isSold: false, price: 100, item: { id: 7, subType: ItemSubType.Club, stats: { strength: 1, enhancedEffect: 24 }, tier: 4 } },
];

let defaultSearchRequest: MarketSearchRequest = {
  type: ItemType.Weapon,
  usableOnly: false,
  tierRange: [0, 0],
  magicLevel: [-1, -1],
  costRange: [0, 999999]
};

function MarketItemSlot({ marketItem, action }: { marketItem?: MarketItem, action?: ItemAction }) {
  const { user } = useUser();
  return (<div className="flex flex-col w-16">
    <ItemSlot item={marketItem?.item} action={action} className={clsx(marketItem && marketItem.userId === user.id && "border-green-500")} />
    {marketItem && <div className="flex flex-row bg-stone-500/50 items-center w-16">
      <span className="flex-grow text-right px-1">{marketItem.price}</span>
      <img src="svg/iconGold.svg" alt="gold" />
    </div>}
  </div>)
}

function CharacterSlot({ character, isSelected, onClick }: { character: Character, isSelected: boolean, onClick: () => void }) {
  const classes = clsx("flex flex-row border p-1", isSelected ? "bg-stone-600" : "bg-stone-800");
  return <div className={classes} onClick={onClick}>
    <div>{character.name} (Lv. {character.level} {character.class})</div>
  </div>
}

type BuyTabState = {

}

type SellTabState = {
  fee: number;
  goldPassword: string;
}

type TransferTabState = {
  selectedCharacter?: Character;
}

export default function MarketplaceWindow() {
  const { user, transferItem } = useUser();
  const { character, buyMarketItem } = useCharacter();
  const { closeWindow, windowState, setWindowState } = useWindow<UIMarketplaceWindowState>(UIWindow.Marketplace);
  const [buyTabState, setBuyTabState] = useState({ searchResults: windowState?.searchResults } as BuyTabState);
  const [sellTabState, setSellTabState] = useState({} as SellTabState);
  const [transferTabState, setTransferTabState] = useState({} as TransferTabState);
  const [searchRequest, setSearchRequest] = useState(defaultSearchRequest);

  const isSellEdit = windowState?.sellItem && user.marketItems.find(x => x.item.id === windowState!.sellItem!.id);

  useEffect(() => {
    //setWindowState({ ...windowState!, isVisible: windowState?.isVisible ?? false, searchResults: marketItems });
  }, []);

  const search = (e: any) => {
    e.preventDefault();
    send(RequestPacketType.SearchMarketItems, searchRequest);
  }

  const buyItem = () => {
    if (!windowState?.buyItem) return;
    var item = windowState.buyItem;
    send(RequestPacketType.BuyItem, { itemId: item.id, price: item.price });
  }

  const updateCost = (cost: string, fromWindowState?: boolean) => {
    const costFloat = parseFloat(cost);
    const fee = Math.floor(costFloat * 5 / 100);
    if (!cost || cost.match(/^\d{1,}(\.\d{0,4})?$/)) {
      if (!fromWindowState) {
        setWindowState({ ...windowState!, sellCost: cost });
      }
      setSellTabState(s => ({ ...s, fee }));
    }
  }

  useEffect(() => {
    updateCost(windowState?.sellCost!, true);
  }, [windowState]);

  const sellOrUpdateItemListing = () => {
    if (!windowState?.sellItem) return;
    if (Number(windowState?.sellCost) < 1 || !user.selectedCharacter) return;

    if (isSellEdit) {
      send(RequestPacketType.UpdateMarketitem, { item: { id: windowState?.sellItem.id }, price: Number(windowState.sellCost) });
    } else {
      if (user.marketItems.length < 16) {
        send(RequestPacketType.SellItem, { itemId: windowState?.sellItem.id, price: Number(windowState.sellCost) }, true);
      }
    }

    setSellTabState({} as SellTabState);
    setWindowState({ ...windowState, sellItem: undefined, sellCost: '' });
  }

  const selectCharacter = (char: Character) => {
    setTransferTabState({ ...transferTabState, selectedCharacter: char });
  }

  const transfer = () => {
    if (!windowState?.transferItem) return;
    if (!transferTabState.selectedCharacter) return;
    send(RequestPacketType.TransferItem, { itemId: windowState.transferItem.id, characterId: transferTabState.selectedCharacter.id });
  }

  useEffect(() => {
    return listen(ResponsePacketType.SearchMarketItems, (e: MarketItem[]) => {
      setWindowState({ ...windowState!, searchResults: e });
    });
  }, [windowState]);

  useEffect(() => {
    return listen(ResponsePacketType.BuyItem, (e: MarketItem) => {
      setWindowState({ ...windowState!, searchResults: windowState!.searchResults.filter(x => x.id !== e.id), buyItem: undefined });
    });
  }, [windowState]);

  useEffect(() => {
    return listen(ResponsePacketType.TransferItem, (e: { itemId: number, characterId: number }) => {
      setWindowState({ ...windowState!, transferItem: undefined });
    });
  }, [windowState]);

  return <Window tabbed isVisible={windowState!.isVisible} close={closeWindow} coords={windowState!.coords} type={windowState!.type}>
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
            <select value={searchRequest.type} onChange={e => setSearchRequest({ ...searchRequest, type: Number(e.target.value) })}>
              {Object.keys(ItemType).filter(x => !isNaN(Number(x))).map(x => Number(x)).map(x => <option key={x} value={x}>{ItemType[x]}</option>)}
            </select>
            <select value={searchRequest.subType} onChange={e => setSearchRequest({ ...searchRequest, subType: Number(e.target.value) })}>
              <option value="-1">Sub Type</option>
              {itemTypes[searchRequest.type].map(x => <option key={x} value={x}>{itemNames[x]}</option>)}
            </select>
            <span>Level Range:</span>
            <div className="flex flex-row gap-x-2 items-center">
              <select value={(searchRequest.tierRange[0])} onChange={e => setSearchRequest({ ...searchRequest, tierRange: [Number(e.target.value), searchRequest.tierRange[1]] })}>
                <option value="0"></option>
                {Object.keys(itemTiers).map(x => Number(x)).filter(x => x > 0).map(x => <option key={x} value={x}>{itemTiers[x]} ({Math.max(0, (x - 3) * 5)})</option>)}
              </select>
              <span>to</span>
              <select value={(searchRequest.tierRange[1])} onChange={e => setSearchRequest({ ...searchRequest, tierRange: [searchRequest.tierRange[0], Number(e.target.value)] })}>
                <option></option>
                {Object.keys(itemTiers).map(x => Number(x)).filter(x => x >= searchRequest.tierRange[0] && x > 0).map(x => <option key={x} value={x}>{itemTiers[x]} ({Math.max(0, (x - 3) * 5)})</option>)}
              </select>
            </div>
            <span>Magic Level:</span>
            <div className="flex flex-row gap-x-2 items-center">
              <select value={(searchRequest.magicLevel[0])} onChange={e => setSearchRequest({ ...searchRequest, magicLevel: [Number(e.target.value), searchRequest.magicLevel[1]] })}>
                <option value="-1"></option>
                {Object.keys(itemMagicPrefixes).map(x => Number(x)).map(x => <option key={x} value={x}>{itemMagicPrefixes[x]}</option>)}
              </select>
              <span>to</span>
              <select value={(searchRequest.magicLevel[1])} onChange={e => setSearchRequest({ ...searchRequest, magicLevel: [searchRequest.magicLevel[0], Number(e.target.value)] })}>
                <option value="-1"></option>
                {Object.keys(itemMagicPrefixes).map(x => Number(x)).filter(x => x >= searchRequest.magicLevel[0]).map(x => <option key={x} value={x}>{itemMagicPrefixes[x]}</option>)}
              </select>
            </div>
            <span>Cost Range:</span>
            <div className="flex flex-row gap-x-2 items-center">
              <input value={searchRequest.costRange[0]} onChange={e => setSearchRequest({ ...searchRequest, costRange: [Number(e.target.value), searchRequest.costRange[1]] })} />
              <span>to</span>
              <input value={searchRequest.costRange[1]} onChange={e => setSearchRequest({ ...searchRequest, costRange: [searchRequest.costRange[1], Number(e.target.value)] })} />
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
                <input type="checkbox" checked={searchRequest.usableOnly} onChange={e => setSearchRequest({ ...searchRequest, usableOnly: e.target.checked })} /> Only show items I can use
              </label>
            </div>
            <button className="mx-auto ignore-reorder" onClick={e => search(e)}>Search</button>
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
                <button onClick={_ => buyItem()} className="ignore-reorder">Buy this item</button>
              </div>
            </div>
          </div>
        </div>
      </Window.TabPanel>
      <Window.TabPanel>
        <div id="sellItems" className="flex flex-col sm:flex-row pt-4 gap-4 h-96 sm:w-[40rem]">
          <div className="basis-1/5 flex flex-row sm:flex-col gap-5 justify-center sm:justify-start items-center">
            <ItemSlot className="flex justify-center place-items-center">
              <div className="w-full h-full flex justify-around">
                <p className="self-center text-2xl">?</p>
              </div>
            </ItemSlot>
            <ItemSlot action={ItemAction.Delete}>
              <img className="absolute inset-0 p-1 mx-auto w-full h-full" src="svg/iconTrash.svg" alt="delete item" />
            </ItemSlot>
          </div>
          <div className="basis-4/5 flex flex-col gap-y-4">
            <div className="flex-grow border p-1">
              {user.marketItems && user.marketItems.length > 0 && <div className="grid grid-cols-6">
                {user.marketItems.map(x => <MarketItemSlot key={x.item.id} marketItem={x} />)}
              </div>}
              {(user.marketItems?.length ?? 0) === 0 && <span className="p-3">No items found.</span>}
            </div>
            <div className="flex flex-row items-center justify-end">
              <div className="px-4">
                <ItemSlot item={windowState?.sellItem} action={ItemAction.Sell} />
              </div>
              <div className="flex flex-col gap-4">
                <label className="flex flex-row">
                  <span className="w-1/4">Cost:</span>
                  <div className="w-3/5"><input value={windowState?.sellCost ?? ''} onChange={e => updateCost(e.target.value)} /></div>
                </label>
                <label className="flex flex-row">
                  <span className="w-1/4">Fee:</span>
                  <div className="w-3/5"><input disabled={true} value={(isNaN(sellTabState.fee) ? 0 : sellTabState.fee) ?? 0} /></div>
                </label>
              </div>
              <div className="flex flex-col gap-y-4">
                <input value={sellTabState.goldPassword ?? ''} onChange={e => setSellTabState({ ...sellTabState, goldPassword: e.target.value })} placeholder="Gold Password" type="password" />
                <button onClick={_ => sellOrUpdateItemListing()} className="ignore-reorder">{isSellEdit ? "Edit listing" : "Sell this item"}</button>
              </div>
            </div>
          </div>
        </div>
      </Window.TabPanel>
      <Window.TabPanel>
        <div id="transfer" className="flex flex-col sm:flex-row pt-4 gap-4 h-96 sm:w-[40rem]">
          <div className="basis-1/5 flex flex-row sm:flex-col gap-5 justify-center sm:justify-start items-center">
            <ItemSlot className="flex justify-center place-items-center">
              <div className="w-full h-full flex justify-around">
                <p className="self-center text-2xl">?</p>
              </div>
            </ItemSlot>
          </div>
          <div className="basis-4/5 flex flex-col gap-y-4">
            <div className="flex-grow border flex flex-col p-2 gap-y-2 overflow-y-auto">
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
  </Window>
}