import Character from "@/models/Character";
import { EquippedItemSlot } from "@/models/EquippedItem";
import Item, { classArmors, classCharms, classWeapons, ItemSubType } from "@/models/Item";
import { ItemAction } from "@/models/ItemAction";
import MarketItem from "@/models/MarketItem";
import { SkillType } from "@/models/Skill";
import { CharacterStats } from "@/models/Stats";
import User from "@/models/User";
import { Zone } from "@/models/Zone";
import { createContext, createRef, useCallback, useContext, useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import { UIMarketplaceWindowState, UIShrineWindowState, UISkillWindowState, useUI, useWindow } from "./UIContext";
import { listen, send } from "@/network/Socket";
import RequestPacketType from "@/network/RequestPacketType";
import ResponsePacketType from "@/network/ResponsePacketType";
import Group from "@/models/Group";
import GroupUser from "@/models/GroupUser";
import { Maze } from "@/models/Maze";
import { Attack } from "@/models/Attack";
import { UIWindow } from "@/models/UIWindow";
import { AttackType } from "@/models/AttackType";

type UserContextData = {
  user: User;
  setCharacters: (characters: Character[]) => void;
  createCharacter: (character: Character) => void;
  deleteCharacter: (character: Character) => void;
  selectCharacter: (character: Character | null) => void;
  updateCharacter: (character: Character) => void;
  transferItem: (item: Item, character: Character) => boolean;
  selectedItemSlot: EquippedItemSlot;
  setSelectedItemSlot: (slot: EquippedItemSlot) => void;
};

const UserContext = createContext<UserContextData>({} as UserContextData);

export default function UserContextProvider({ children }: React.PropsWithChildren) {
  const [user, setUser] = useState<User>({ id: 1, characters: [], gold: 1000, username: 'DatBear', marketItems: [] });
  const [selectedItemSlot, setSelectedItemSlot] = useState(EquippedItemSlot.Weapon);

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
    if (user.group) {
      var groupUser = user.group.users.find(x => x.user?.id === user.id)?.user;
      if (groupUser) {
        groupUser.selectedCharacter = character;
      }
    }
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
  };

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
  }, [user, setUser, updateGroup]);

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

  useEffect(() => {
    return listen(ResponsePacketType.UpdateMaze, (e: Maze) => {
      e.mobs = e.mobs.map(x => ({ ...x, ref: createRef<HTMLImageElement>() }));
      if (user.group) {
        user.group.maze = e;
      } else {
        user.maze = e;
      }
      setUser({ ...user });
    });
  }, [user, setUser]);

  useEffect(() => {
    return listen(ResponsePacketType.UpdateCharacter, (e: Character) => {
      if (e.id === user.selectedCharacter?.id) {
        updateCharacter(e);
      } else {
        let existingUser = user.group?.users?.find(x => x.user?.selectedCharacter?.id == e.id);
        if (existingUser) {
          existingUser.user!.selectedCharacter = { ...e, imageRef: existingUser.user!.selectedCharacter?.imageRef! };
        }
        setUser({ ...user });
      }
    });
  }, [user.selectedCharacter, updateCharacter, setUser]);

  useEffect(() => {
    return listen(ResponsePacketType.AttackTarget, (e: Attack) => {
      const maze = user.group?.maze ?? user.maze!;
      const mobs = maze?.mobs;
      switch (e.type) {
        case AttackType.PlayerAttack:

          let target = mobs.find(x => x.id === e.targetId);
          if (!target) return;

          target.life = e.targetHealthResult;
          if (target.life <= 0) {
            maze.mobs = mobs.filter(x => x.id !== target!.id);
          }
          setUser({ ...user });
          break;

        case AttackType.MobAttack:
          let playerTarget = user.group?.users.find(x => x.user?.selectedCharacter?.id === e.targetId)?.user?.selectedCharacter ?? (user.selectedCharacter?.id == e.targetId ? user.selectedCharacter : null);
          if (!playerTarget) return;

          if (playerTarget.id === user.selectedCharacter?.id) {
            user.selectedCharacter.life = e.targetHealthResult;
          }

          playerTarget.life = e.targetHealthResult;
          if (playerTarget.life <= 0) {
            //todo player death
          }
          setUser({ ...user });
          break;
      }
    });
  }, [user]);

  useEffect(() => {
    if (!user.selectedCharacter) return;
    var nextRegen = 1000 - (new Date().getTime() - user.selectedCharacter.lastRegenAction);
    if (nextRegen < 0) {
      regen();
      nextRegen = 1000;
    }

    var timeout = setTimeout(regen, nextRegen);
    return () => clearTimeout(timeout);
  }, [user]);

  const regen = () => {
    if (user.group) {
      for (var groupUser of user.group?.users) {
        let groupChar = groupUser.user?.selectedCharacter;
        if (!groupChar || groupChar.zone == Zone.Catacombs || groupChar.lastRegenAction > new Date().getTime() - 1000) continue;
        groupChar.lastRegenAction = new Date().getTime();
        groupChar.life += Math.min(groupChar.stats.lifeRegen, groupChar.stats.maxLife - groupChar.life);
        groupChar.mana += Math.min(groupChar.stats.manaRegen, groupChar.stats.maxMana - groupChar.mana);
      }
    }

    if (!user.selectedCharacter) return;
    var char = user.selectedCharacter!;
    char.lastRegenAction = new Date().getTime();
    char.life += Math.max(0, Math.min(char.stats.lifeRegen ?? 0, char.stats.maxLife - char.life));
    char.mana += Math.max(0, Math.min(char.stats.manaRegen ?? 0, char.stats.maxMana - char.mana));
    setUser({ ...user });
  }

  useEffect(() => {
    return listen(ResponsePacketType.SellItem, (e: { item: MarketItem }) => {
      user.marketItems.push(e.item);
      if (user.selectedCharacter) {
        user.selectedCharacter.items = user.selectedCharacter.items.filter(x => x.id !== e.item.item.id);
        user.selectedCharacter.equipment = user.selectedCharacter.equipment.filter(x => x.id !== e.item.item.id);
        user.selectedCharacter.equippedItems = user.selectedCharacter.equippedItems.filter(x => x.id !== e.item.item.id);
      }
      setUser({ ...user });
    }, true);
  }, [user]);

  useEffect(() => {
    return listen(ResponsePacketType.BuyItem, (e: MarketItem) => {
      user.gold -= e.price;
      let isItem = e.item.subType >= ItemSubType.Fish;
      if (isItem) {
        user.selectedCharacter?.items.push(e.item);
      } else {
        user.selectedCharacter?.equipment.push(e.item);
      }
      setUser({ ...user });
    }, true);
  }, [user]);

  useEffect(() => {
    return listen(ResponsePacketType.UpdateMarketItem, (e: MarketItem) => {
      if (e.isSold) {
        user.gold += e.price;
        user.marketItems = user.marketItems.filter(x => x.id !== e.id);
        setUser({ ...user });
      } else {
        user.marketItems = user.marketItems.filter(x => x.id !== e.id).concat(e);
        setUser({ ...user });
      }
    });
  }, [user]);

  useEffect(() => {
    return listen(ResponsePacketType.CancelMarketItem, (e: MarketItem) => {
      user.marketItems = user.marketItems.filter(x => x.id !== e.id);
      let isItem = e.item.subType >= ItemSubType.Fish;
      if (isItem) {
        user.selectedCharacter?.items.push(e.item);
      } else {
        user.selectedCharacter?.equipment.push(e.item);
      }
    }, true);
  }, [user]);

  useEffect(() => {
    return listen(ResponsePacketType.TransferItem, (e: { itemId: number, characterId: number }) => {
      let equipmentItem = user.selectedCharacter?.equipment.find(x => x.id === e.itemId);
      if (equipmentItem) {
        user.selectedCharacter!.equipment = user.selectedCharacter!.equipment.filter(x => x.id !== e.itemId);
        user.characters.find(x => x.id === e.characterId)?.equipment.push(equipmentItem);
        return;
      }

      let invItem = user.selectedCharacter?.items.find(x => x.id === e.itemId);
      if (invItem) {
        user.selectedCharacter!.items = user.selectedCharacter!.items.filter(x => x.id !== e.itemId);
        user.characters.find(x => x.id === e.characterId)?.items.push(invItem);
      }
    });
  });

  return <UserContext.Provider value={{ user, setCharacters, createCharacter, deleteCharacter, selectCharacter, updateCharacter, transferItem, selectedItemSlot, setSelectedItemSlot }}>
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
    if (!canUnequipItem()) return false;
    send(RequestPacketType.UnequipItem, slot, true);
    //this is client side and gets updated by the updatecharacter packet later
    var currentItem = character.equippedItems.find(x => x.equippedItemSlot === slot);
    if (currentItem) {
      character.equipment.push(currentItem);
      character.equippedItems = character.equippedItems.filter(x => x.equippedItemSlot !== currentItem!.equippedItemSlot);
      console.log('char', character);
      updateCharacter(character);
      return true;
    }
    return false;
  }

  const canEquipItem = useCallback((item: Item, slot: EquippedItemSlot): boolean => {
    if (item == null) return false;
    let maxTier = Math.floor(3 + character.level / 5);
    let subTypes = slot == EquippedItemSlot.Armor ? classArmors[character.class] : slot == EquippedItemSlot.Weapon ? classWeapons[character.class] : classCharms[character.class];

    let canEquipSubType = subTypes!.find(x => x === item.subType) !== undefined;
    let canEquipTier = maxTier >= item.tier;
    return canEquipSubType && canEquipTier;
  }, [character]);

  const canUnequipItem = useCallback((): boolean => {
    return character.equipment.length < character.equipmentSlots;
  }, [character]);

  const canDoItemAction = (item: Item, action: ItemAction, skill?: SkillType): boolean => {
    switch (action) {
      case ItemAction.Sell:
        return character.equipment.find(x => x.id === item.id) !== undefined || character.items.find(x => x.id === item.id) !== undefined || user.marketItems.find(x => x.item.id === item.id) !== undefined;
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
      case ItemAction.Swap:
        return true;
    }
    return true;
  }

  const doItemAction = (item: Item, action: ItemAction, skill?: SkillType) => {
    if (!canDoItemAction(item, action, skill)) return;
    switch (action) {
      case ItemAction.Sell:
        if (!marketplaceWindowState) return;
        marketplaceWindowState.sellItem = item;
        marketplaceWindowState.sellCost = user.marketItems.find(x => x.item.id === item.id)?.price?.toString() ?? '';
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
        break;
      case ItemAction.PickUp:
        send(RequestPacketType.PickGroundItem, item.id);
        break;
      case ItemAction.Use:
        send(RequestPacketType.UseItem, { itemId: item.id, targetId: character.id }, true);
      case ItemAction.Swap:
        if (user.marketItems.find(x => x.item.id === item.id) !== undefined) {
          send(RequestPacketType.CancelMarketItem, item.id);
        }
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
    send(RequestPacketType.ShrineItem, invItem.id);
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
    send(RequestPacketType.ChangeZone, zone);
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