import Character from "@/models/Character";
import { EquippedItemSlot } from "@/models/EquippedItem";
import Item, { classArmors, classCharms, classWeapons, ItemSubType } from "@/models/Item";
import { ItemAction } from "@/models/ItemAction";
import MarketItem from "@/models/MarketItem";
import { SkillType } from "@/models/Skill";
import { CharacterStats } from "@/models/Stats";
import User from "@/models/User";
import { Zone } from "@/models/Zone";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import { UIMarketplaceWindowState, UIShrineWindowState, UISkillWindowState, UIWindow, useUI, useWindow } from "./UIContext";
import { listen, send } from "@/network/Socket";
import RequestPacketType from "@/network/RequestPacketType";
import ResponsePacketType from "@/network/ResponsePacketType";
import Group from "@/models/Group";
import GroupUser from "@/models/GroupUser";

type UserContextData = {
  user: User;
  setCharacters: (characters: Character[]) => void;
  createCharacter: (character: Character) => void;
  deleteCharacter: (character: Character) => void;
  selectCharacter: (character: Character | null) => void;
  updateCharacter: (character: Character) => void;
  listMarketItem: (item: MarketItem) => boolean;
  transferItem: (item: Item, character: Character) => boolean;
};

const UserContext = createContext<UserContextData>({} as UserContextData);

export default function UserContextProvider({ children }: React.PropsWithChildren) {
  const [user, setUser] = useState<User>({ id: 1, characters: [], gold: 1000, username: 'DatBear', marketItems: [] });

  const setCharacters = (characters: Character[]) => {
    setUser(user => ({
      ...user,
      characters
    }));
  }

  const createCharacter = (character: Character) => {
    send(RequestPacketType.CreateCharacter, character);
  }

  const deleteCharacter = (character: Character) => {
    setUser(user => ({ ...user, characters: user.characters.filter(x => x.id !== character.id) }));
  }

  const selectCharacter = (character: Character | null) => {
    send(RequestPacketType.SelectCharacter, character?.id, true);
  }

  const updateCharacter = (character: Character) => {
    user.characters.splice(user.characters.findIndex(x => x.id === character.id), 1, character);
    setUser(_ => ({
      ...user,
      selectedCharacter: { ...character }
    }));
  }

  const updateGroup = (group: Group | null) => {
    setUser(user => ({
      ...user,
      group: group
    }))
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

  useEffect(() => {
    return listen(ResponsePacketType.GetUser, (e: User) => {
      setUser(e);
      send(RequestPacketType.ListCharacters, null);
    }, true);
  });

  useEffect(() => {
    return listen(ResponsePacketType.SelectCharacter, (e?: number) => {
      const character = user.characters.find(x => x.id === e);
      if (character != null) {
        character.zone = Zone.Town;
      }
      setUser(user => ({
        ...user,
        selectedCharacter: character || null
      }));
    }, true);
  }, [user]);

  useEffect(() => {
    return listen(ResponsePacketType.CreateGroup, (e: Group) => {
      updateGroup(e);
    }, true);
  }, [updateGroup]);

  useEffect(() => {
    return listen(ResponsePacketType.LeaveGroup, (e: User) => {
      console.log('leave group!!!', e, user);
      if (e.id === user.id) {
        console.log('updated group to null');
        updateGroup(null);
      } else {
        if (user.group) {
          user.group.users = user.group?.users.filter(x => x.user?.id !== e.id);
          setUser(user);
        }
      }
    }, true);
  }, [user, setUser]);

  useEffect(() => {
    return listen(ResponsePacketType.JoinGroup, (e: GroupUser) => {
      user.group?.users.push(e);
      setUser({ ...user });
    }, true);
  }, [user, setUser]);

  useEffect(() => {
    return listen(ResponsePacketType.SetGroupLeader, (e: number) => {
      if (!user.group) return;

      user.group!.leaderId = e;
      setUser({ ...user });
    });
  }, [user, setUser]);

  return <UserContext.Provider value={{ user, setCharacters, createCharacter, deleteCharacter, selectCharacter, updateCharacter, listMarketItem, transferItem }}>
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
  const skillWindows: Record<SkillType, ReturnType<typeof useWindow<UISkillWindowState>>> = {
    [SkillType.Fishing]: useWindow<UISkillWindowState>(UIWindow.Fishing),
    [SkillType.Cooking]: useWindow<UISkillWindowState>(UIWindow.Cooking),
    [SkillType.Suffusencing]: useWindow<UISkillWindowState>(UIWindow.Suffusencing),
    [SkillType.Glyphing]: useWindow<UISkillWindowState>(UIWindow.Glyphing),
    [SkillType.Transmuting]: useWindow<UISkillWindowState>(UIWindow.Transmuting)
  }
  const character = user.selectedCharacter!

  function equipItem(item: Item, slot: EquippedItemSlot) {
    if (!canEquipItem(item, slot)) return;
    send(RequestPacketType.EquipItem, { itemId: item.id, equippedItemSlot: slot }, true);
    //console.log('equip to ', slot, ' item', item);
    //this is client side and gets updated by the updatecharacter packet later
    var currentItem = character.equippedItems.find(x => x.equippedItemSlot === slot);
    if (currentItem != null) {
      const oldItem = { ...currentItem };
      currentItem = item;
      let idx = character.equipment.findIndex(x => x?.id === item.id);
      character.equipment.splice(idx, 1, oldItem);
    } else {
      character.equippedItems.push({
        ...item, equippedItemSlot: slot
      });
    }
    character.equipment = character.equipment.filter(x => x.id !== item.id);
    updateCharacter(character);
  }

  function unequipItem(slot: EquippedItemSlot) {
    if (!canUnequipItem()) return;
    send(RequestPacketType.UnequipItem, slot, true);
    //this is client side and gets updated by the updatecharacter packet later
    var currentItem = character.equippedItems.find(x => x.equippedItemSlot === slot);
    if (currentItem) {
      character.equipment.push(currentItem);
      character.equippedItems = character.equippedItems.filter(x => x.equippedItemSlot !== currentItem!.equippedItemSlot);
      updateCharacter(character);
    }
  }

  const canEquipItem = useCallback((item: Item, slot: EquippedItemSlot): boolean => {
    if (item == null || character.equipment.find(x => x?.id === item.id) == undefined) return false;
    let maxTier = Math.floor(3 + character.level / 5);
    let subTypes = slot == EquippedItemSlot.Armor ? classArmors[character.class] : slot == EquippedItemSlot.Weapon ? classWeapons[character.class] : classCharms[character.class];

    let canEquipSubType = subTypes!.find(x => x == item.subType) !== undefined;
    let canEquipTier = maxTier >= item.tier;
    return canEquipSubType && canEquipTier;
  }, [character]);

  const canUnequipItem = useCallback((): boolean => {
    return character.equipment.length < character.equipmentSlots;
  }, [character]);

  const canDoItemAction = (item: Item, action: ItemAction, skill?: SkillType): boolean => {
    switch (action) {
      case ItemAction.Sell:
        return character.equipment.find(x => x.id === item.id) !== undefined;
      case ItemAction.Buy:
        return marketplaceWindowState?.searchResults.find(x => x.item.id === item.id) !== undefined;
      case ItemAction.Transfer:
        return character.equipment.find(x => x.id === item.id) !== undefined;
      case ItemAction.Shrine:
        return character.equipment.find(x => x.id === item.id) !== undefined && Object.keys(item.stats).length > 0;
      case ItemAction.SetSkill:
        if (skill === undefined) return false;
        switch (skill) {
          case SkillType.Fishing:
            return character.items.find(x => x.id === item.id) !== undefined && item.subType == ItemSubType.FishingRod;
          case SkillType.Cooking:
            return character.items.find(x => x.id === item.id) !== undefined && item.subType === ItemSubType.Fish;
          //todo glyphing, transmuting, suffusencing
        }
        break;
    }
    return true;
  }

  const doItemAction = (item: Item, action: ItemAction, skill?: SkillType) => {
    if (!canDoItemAction(item, action, skill)) return;
    switch (action) {
      case ItemAction.Sell:
        if (!marketplaceWindowState) return;
        marketplaceWindowState.sellItem = item;
        setMarketplaceWindowState(marketplaceWindowState);
        break;
      case ItemAction.Buy:
        if (!marketplaceWindowState) return;
        marketplaceWindowState.buyItem = marketplaceWindowState.searchResults.find(x => x.item.id === item.id);
        setMarketplaceWindowState(marketplaceWindowState);
        break;
      case ItemAction.Transfer:
        if (!marketplaceWindowState) return;
        if (!character.equipment.find(x => x.id === item.id)) return;
        marketplaceWindowState.transferItem = item;
        setMarketplaceWindowState(marketplaceWindowState);
        break;
      case ItemAction.Shrine:
        if (!shrineWindowState) return;
        if (!character.equipment.find(x => x.id === item.id)) return;
        shrineWindowState.shrineItem = item;
        setShrineWindowState(shrineWindowState);
        break;
      case ItemAction.SetSkill:
      case ItemAction.SetSkill2:
        if (skill === undefined || !skillWindows[skill] || !skillWindows[skill].windowState) return;
        skillWindows[skill].windowState!.items[action == ItemAction.SetSkill ? 0 : 1] = item;
        skillWindows[skill].setWindowState(skillWindows[skill].windowState!);
        break;
      case ItemAction.Delete:
        send(RequestPacketType.DeleteItem, item.id);
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
    character.life = Math.min(character.stats.maxLife!, character.life - 10);
    character.mana = Math.min(character.stats.maxMana!, character.mana - 20);
    updateCharacter(character);
    return true;
  }

  const addStatPoint = (stat: string) => {
    if (character.statPoints <= 0) return;
    character.statPoints -= 1;
    //@ts-ignore
    character.stats[stat] += 1;
    updateCharacter(character);
  }

  const goToZone = (zone: Zone) => {
    character.zone = zone;
    updateCharacter(character);
  }

  const addKill = () => {
    character.kills += 1;
    updateCharacter(character);
  }

  const addDeath = () => {
    character.deaths += 1;
    //todo log out hc
    updateCharacter(character);
  }

  const addExperience = (exp: number) => {
    character.experience += exp;
    if (character.experience >= character.level * 1000000) {
      character.experience = character.level * 1000000;
      character.level += 1;
      character.statPoints += 1;
      character.life = character.stats.maxLife!;
      character.mana = character.stats.maxMana!;
      //todo max life + mana + etc
    }
    updateCharacter(character);
  }

  useEffect(() => {
    return listen(ResponsePacketType.UpdateCharacter, (e: Character) => {
      if (e.id === character.id) {
        updateCharacter(e);
      }
    });
  }, [character]);

  return {
    character,
    hasSelectedCharacter: user.selectedCharacter !== null,
    canEquipItem, equipItem,
    canUnequipItem, unequipItem,
    canDoItemAction, doItemAction,
    buyMarketItem,
    shrineItem,
    addStatPoint,
    goToZone,
    addExperience, addKill, addDeath
  };
}