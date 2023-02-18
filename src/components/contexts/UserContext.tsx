import Character, { classStats, defaultCharacterStats } from "@/models/Character";
import { EquippedItemSlot } from "@/models/EquippedItem";
import Item, { classArmors, classCharms, classWeapons, defaultEquippedItems, defaultStats, getItemType, ItemSubType, ItemType } from "@/models/Item";
import { ItemAction } from "@/models/ItemAction";
import MarketItem from "@/models/MarketItem";
import { CharacterStats } from "@/models/Stats";
import User from "@/models/User";
import { createContext, useCallback, useContext, useState } from "react";
import { v4 as uuid } from "uuid";
import { UIMarketplaceWindowState, UIShrineWindowState, UIWindow, useUI, useWindow } from "./UIContext";

const defaultInventoryItems = [
  { id: uuid(), subType: ItemSubType.Club, stats: defaultStats, tier: 4 },
  { id: uuid(), subType: ItemSubType.Club, stats: defaultStats, tier: 3 },
  { id: uuid(), subType: ItemSubType.PaddedRobe, stats: defaultStats, tier: 3 },
  { id: uuid(), subType: ItemSubType.Fire, stats: defaultStats, tier: 3 },
  { id: uuid(), subType: ItemSubType.Fire, stats: defaultStats, tier: 3 },
  { id: uuid(), subType: ItemSubType.PlateMail, stats: defaultStats, tier: 3 }
];

const defaultPartialCharacter: Partial<Character> = {
  level: 1,
  stats: defaultCharacterStats,
  life: defaultCharacterStats[CharacterStats.MaxLife],
  mana: defaultCharacterStats[CharacterStats.MaxMana],
  items: [],
  experience: 0,
  equipmentSlots: 8
}

type UserContextData = {
  user: User;
  createCharacter: (character: Character) => void;
  deleteCharacter: (character: Character) => void;
  selectCharacter: (character: Character | null) => void;
  updateCharacter: (character: Character) => void;
  listMarketItem: (item: MarketItem) => boolean;
  transferItem: (item: Item, character: Character) => boolean;
};

const UserContext = createContext<UserContextData>({} as UserContextData);

export default function UserContextProvider({ children }: React.PropsWithChildren) {
  const [user, setUser] = useState<User>({ id: 1, characters: [], gold: 1000, name: 'DatBear', marketItems: [] });

  const createCharacter = (character: Character) => {
    const char = {
      ...character,
      ...defaultPartialCharacter,
      equippedItems: defaultEquippedItems[character.class],
      equipment: [...defaultInventoryItems.map(x => ({ ...x, id: uuid() }))],
      stats: { ...defaultCharacterStats, ...classStats[character.class] }
    } as Character;
    setUser(user => ({ ...user, characters: user.characters.concat(char) }));
  }

  const deleteCharacter = (character: Character) => {
    setUser(user => ({ ...user, characters: user.characters.filter(x => x.id !== character.id) }));
  }

  const selectCharacter = (character: Character | null) => {
    setUser(user => ({ ...user, selectedCharacter: character }));
  }

  const updateCharacter = (character: Character) => {
    setUser(user => ({
      ...user,
      selectedCharacter: { ...character },
      characters: user.characters.splice(user.characters.findIndex(x => x.id === character.id), 1, character)
    }));
  }

  const listMarketItem = (item: MarketItem) => {
    if (user.marketItems.length < 16 && item.price > 0 && user.selectedCharacter) {
      user.marketItems.push(item);
      user.selectedCharacter.equipment = user.selectedCharacter.equipment.filter(x => x.id !== item.item.id);
      setUser(x => ({ ...x, marketItems: user.marketItems }));
      return true;
    }
    return false;
  }

  const transferItem = (item: Item, character: Character) => {
    if (!item || !character || !user.selectedCharacter) return false;
    if (character.equipment.length >= character.equipmentSlots) return false;
    if (user.selectedCharacter.equipment.find(x => x.id === item.id) == undefined) return false;

    character.equipment.push(item);
    user.selectedCharacter.equipment = user.selectedCharacter.equipment.filter(x => x.id !== item.id);
    return true;
  }

  return <UserContext.Provider value={{ user, createCharacter, deleteCharacter, selectCharacter, updateCharacter, listMarketItem, transferItem }}>
    {children}
  </UserContext.Provider>
}

export function useUser() {
  let context = useContext(UserContext);
  return context!;
}

export function useCharacter() {
  const { user, updateCharacter } = useUser();
  const { windowState: marketplaceWindowState, setWindowState: setMarketplaceWindowState } = useWindow<UIMarketplaceWindowState>(UIWindow.Marketplace);
  const { windowState: shrineWindowState, setWindowState: setShrineWindowState } = useWindow<UIShrineWindowState>(UIWindow.Shrine);
  const character = user.selectedCharacter!

  function equipItem(item: Item, slot: EquippedItemSlot) {
    if (!canEquipItem(item, slot)) return;
    //console.log('equip to ', slot, ' item', item);
    var currentItem = character.equippedItems.find(x => x.slot === slot);
    if (currentItem != null) {
      const oldItem = { ...currentItem.item };
      currentItem.item = item;
      let idx = character.equipment.findIndex(x => x?.id === item.id);
      character.equipment.splice(idx, 1, oldItem);
    } else {
      character.equippedItems.push({
        item, slot
      });
    }

    character.equipment = character.equipment.filter(x => x.id !== item.id);
    updateCharacter(character);
  }

  function unequipItem(slot: EquippedItemSlot) {
    if (!canUnequipItem()) return;
    var currentItem = character.equippedItems.find(x => x.slot === slot);
    if (currentItem) {
      character.equipment.push(currentItem.item);
      character.equippedItems = character.equippedItems.filter(x => x.slot !== currentItem!.slot);
      updateCharacter(character);
    }
  }

  const canEquipItem = useCallback((item: Item, slot: EquippedItemSlot) => {
    if (item == null || character.equipment.find(x => x?.id === item.id) == undefined) return false;
    let canEquip = true;
    let maxTier = Math.floor(3 + character.level / 5);
    let subTypes = slot == EquippedItemSlot.Armor ? classArmors[character.class] : slot == EquippedItemSlot.Weapon ? classWeapons[character.class] : classCharms[character.class];

    if (canEquip && (subTypes?.length ?? 0) > 0) {
      let canEquipSubType = subTypes!.find(x => x == item.subType) !== undefined;
      //console.log('canEquip', canEquipSubType, 'dragSubType', item.subType, subTypes);
      canEquip &&= canEquipSubType;
    }
    if (canEquip && maxTier >= 0) {
      let canEquipTier = maxTier >= item.tier;
      //console.log('canEquip', canEquipTier, 'dragTier', item.tier, 'max tier', maxTier);
      canEquip &&= canEquipTier;
    }
    //console.log('canEquip', canEquip, draggedItem);
    return canEquip;
  }, [character]);

  const canUnequipItem = useCallback(() => {
    return character.equipment.length < character.equipmentSlots;
  }, [character]);

  const canDoItemAction = (item: Item, action: ItemAction) => {
    switch (action) {
      case ItemAction.Sell:
        return character.equipment.find(x => x.id === item.id) != undefined;
    }
    return true;
  }

  const doItemAction = (item: Item, action: ItemAction) => {
    if (!canDoItemAction(item, action)) return;
    switch (action) {
      case ItemAction.Sell:
        if (!marketplaceWindowState) return;
        marketplaceWindowState.sellItem = item;
        setMarketplaceWindowState(marketplaceWindowState);
        break;
      case ItemAction.Buy:
        if (!marketplaceWindowState) return;
        marketplaceWindowState.buyItem = marketplaceWindowState.searchResults.find(x => x.item.id === item.id);
        console.log("buy", marketplaceWindowState.buyItem);
        setMarketplaceWindowState(marketplaceWindowState);
        break;
      case ItemAction.Transfer:
        if (!marketplaceWindowState) return;
        marketplaceWindowState.transferItem = item;
        setMarketplaceWindowState(marketplaceWindowState);
        break;
      case ItemAction.Shrine:
        if (!shrineWindowState) return;
        if (!character.equipment.find(x => x.id === item.id)) return;
        shrineWindowState.shrineItem = item;
        setShrineWindowState(shrineWindowState);
        break;
    }
  }

  const buyMarketItem = (item: MarketItem) => {
    if (character == null || character.equipment.length >= character.equipmentSlots) return false;
    if (marketplaceWindowState?.buyItem == null) return false;
    if (user.gold < item.price) return;

    character.equipment = character.equipment.concat(marketplaceWindowState?.buyItem?.item);
    updateCharacter(character);
    marketplaceWindowState.buyItem = undefined;
    marketplaceWindowState.searchResults = marketplaceWindowState.searchResults.filter(x => x.item.id !== item.item.id);
    setMarketplaceWindowState(marketplaceWindowState);
    user.gold -= item.price;
    return true;
  }

  const shrineItem = (item: Item) => {
    const invItem = character.equipment.find(x => x.id === item.id);
    if (!invItem) return false;
    character.equipment = character.equipment.filter(x => x.id !== item.id);
    character.life = Math.min(character.stats[CharacterStats.MaxLife], character.life - 10);//todo heal based on item
    character.mana = Math.min(character.stats[CharacterStats.MaxMana], character.mana - 20);
    updateCharacter(character);
    return true;
  }

  return {
    character,
    hasSelectedCharacter: user.selectedCharacter !== null,
    canEquipItem, equipItem,
    canUnequipItem, unequipItem,
    canDoItemAction, doItemAction,
    buyMarketItem,
    shrineItem
  };
}