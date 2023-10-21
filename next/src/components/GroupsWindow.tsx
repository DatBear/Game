import Character, { CharacterClass } from "@/models/Character";
import Group from "@/models/Group";
import { useCallback, useEffect, useState } from "react";
import { useWindow, UIWindowState } from "./contexts/UIContext";
import Window from "./Window";
import User from "@/models/User";
import RequestPacketType from "@/network/RequestPacketType";
import { listen, send } from "@/network/Socket";
import FightingPosition from "@/models/FightingPosition";
import { useUser } from "./contexts/UserContext";
import GroupOptions from "@/models/GroupOptions";
import ResponsePacketType from "@/network/ResponsePacketType";
import clsx from "clsx";
import { UIWindow } from "@/models/UIWindow";

let chars: Partial<Character>[] = [
  { name: 'randPlayer', level: 1, class: CharacterClass.Warlock, guild: 'Slashers of the Night' },
  { name: 'anotherPlayer', level: 50, class: CharacterClass.Paladin, guild: 'Mount Olympus' },
  { name: 'PlayerThree', level: 1, class: CharacterClass.Magician, guild: 'Almost Decent' },
];

const isInGroup = (group: Group, user: User) => {
  return group.users.find(x => x.user?.id === user.id) !== undefined;
}

function guildName(name?: string) {
  return name && name !== '' ? `(${name})` : '';
}

function GroupListing({ group, isSelected, setSelectedGroup }: { group: Group, isSelected: boolean, setSelectedGroup: (group: Group) => void }) {
  const { user } = useUser();

  const leader = () => {
    return group.users.find(x => x.user!.id === group.leaderId)!.user!;
  }

  return <div className={clsx("flex flex-row flex-wrap w-full outline outline-1 bg-stone-700 hover:bg-stone-600 px-1 ignore-reorder", isInGroup(group, user) ? "outline-green-400" : "outline-white")} onClick={() => setSelectedGroup(group)}>
    {isSelected && <div className="pr-1">&gt;</div>}
    <div className="basis-1/12">{group.users.length}/5</div>
    <div className="basis-2/12">Lv {leader().selectedCharacter?.level}</div>
    <div className="basis-2/12">{leader().selectedCharacter?.class}</div>
    <div className="flex-grow basis-4/12">{leader().selectedCharacter?.name}{guildName("tester's guild")}</div>
    {isSelected && <div>&lt;</div>}
  </div>
}

function CharListing({ char }: { char: Character }) {
  return (<div className="px-1 w-full outline outline-1 bg-stone-700 hover:bg-stone-600">
    Lvl {char.level} {char.class} {char.name} {guildName(char.guild)}
  </div>)
}


const defaultGroupOptions: GroupOptions = {
  autoInvite: true,
  levelJoinRange: 5,
  guildOnly: false
}

export default function GroupsWindow() {
  const { windowState, closeWindow } = useWindow<UIWindowState>(UIWindow.Groups);
  const { user } = useUser();

  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [groupOptions, setGroupOptions] = useState<GroupOptions>(defaultGroupOptions);

  const refreshGroupList = () => {
    send(RequestPacketType.ListGroups, null);
  }

  const createGroup = () => {
    send(RequestPacketType.CreateGroup, groupOptions);
  };

  const joinOrLeaveGroup = () => {
    if (isInGroup(selectedGroup!, user)) {
      send(RequestPacketType.LeaveGroup, selectedGroup!.id, true);
    } else {
      send(RequestPacketType.JoinGroup, selectedGroup!.id, true);
    }
  }

  useEffect(() => {
    return listen(ResponsePacketType.ListGroups, (e: Group[]) => {
      setGroups(e);
      setSelectedGroup(null);
    }, true);
  }, []);

  useEffect(() => {
    return listen(ResponsePacketType.CreateGroup, (e: Group) => {
      send(RequestPacketType.ListGroups, null);
    });
  }, []);

  useEffect(() => {
    return listen(ResponsePacketType.JoinGroup, (e: User) => {
      send(RequestPacketType.ListGroups, null);
    });
  }, [groups, setGroups]);

  useEffect(() => {
    return listen(ResponsePacketType.LeaveGroup, (e: User) => {
      send(RequestPacketType.ListGroups, null);
    });
  }, [groups, setGroups]);

  useEffect(() => {
    if (windowState?.isVisible) {
      refreshGroupList();
    }
  }, [windowState]);


  return <Window tabbed isVisible={windowState!.isVisible} close={closeWindow} coords={windowState!.coords} type={windowState!.type}>
    <Window.Title>
      <Window.TabList>
        <Window.Tab>Group List</Window.Tab>
        <Window.Tab>Create Group</Window.Tab>
        <Window.Tab>Find Players</Window.Tab>
      </Window.TabList>
    </Window.Title>
    <Window.TabPanels>
      <Window.TabPanel>
        <div id="groupList" className="flex flex-col text-sm p-1 h-48">
          <div className="flex-grow flex flex-col w-full p-1 gap-y-1 overflow-y-auto">
            {groups.length > 0 && groups.map(x => <GroupListing key={x.id} group={x} isSelected={x.id === selectedGroup?.id} setSelectedGroup={setSelectedGroup} />)}
            {groups.length == 0 && <div>No groups found.</div>}
          </div>
          <hr className="py-3" />
          <div className="flex flex-row gap-x-5 place-content-center">
            <div className="flex flex-row gap-x-2">
              <button onClick={refreshGroupList}>
                <img src="svg/iconRefresh.svg" alt="refresh" />
              </button>
              <label className="flex flex-row place-content-center items-center">
                <input type="checkbox" /><span className="px-1">All</span>
              </label>
            </div>
            <div>
              {selectedGroup && <button onClick={joinOrLeaveGroup}>{isInGroup(selectedGroup, user) ? "Leave" : "Join"} Selected Group</button>}
            </div>
          </div>
        </div>
      </Window.TabPanel>
      <Window.TabPanel>
        <div id="createGroup" className="flex flex-col text-sm p-1 h-48">
          <form className="flex-grow flex flex-col gap-y-2 self-center place-content-center">
            <label className="w-full flex flex-row gap-x-2 items-center">
              <span>Level Join Range:</span>
              <div className="w-12"><input value={groupOptions.levelJoinRange} onChange={e => !isNaN(Number(e.target.value)) && setGroupOptions({ ...groupOptions, levelJoinRange: Number(e.target.value) })} /></div>
            </label>
            <label className="w-full flex flex-row gap-x-2">
              <input type="checkbox" checked={groupOptions.autoInvite} onChange={e => setGroupOptions({ ...groupOptions, autoInvite: e.target.checked })} /><span>Auto Invite Others</span>
            </label>
            <label className="w-full flex flex-row gap-x-2">
              <input type="checkbox" checked={groupOptions.guildOnly} onChange={e => setGroupOptions({ ...groupOptions, guildOnly: e.target.checked })} /><span>Guild Only</span>
            </label>
          </form>
          <hr className="py-3" />
          <div className="flex place-content-center">
            <div>
              <button onClick={createGroup}>Create Group</button>
            </div>
          </div>
        </div>
      </Window.TabPanel>
      <Window.TabPanel>
        <div id="findPlayers" className="flex flex-col text-sm p-1 h-48">
          <div className="flex-grow flex flex-col w-full p-1 gap-y-1 overflow-y-auto">
            {chars.length > 0 && chars.map(x => <CharListing key={x.name} char={x as Character} />)}
          </div>
          <hr className="py-3" />
          <div className="flex flex-row">
            <div className="flex flex-row w-full gap-x-3">
              <label className="w-full flex flex-row gap-x-2 items-center">
                <span>Level:</span>
                <div className="w-12"><input defaultValue={5} /></div>
              </label>
              <label className="w-full flex flex-row gap-x-2 items-center">
                <span>Range:</span>
                <div className="w-12"><input defaultValue={5} /></div>
              </label>
              <div className="flex-grow w-full">
                <button>Find players</button>
              </div>
            </div>
          </div>
        </div>
      </Window.TabPanel>
    </Window.TabPanels>
  </Window>
}