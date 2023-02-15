import Character, { CharacterClass } from "@/models/Character";
import Group from "@/models/Group";
import { useCallback } from "react";
import { useWindow, UIWindow } from "./contexts/UIContext";
import Window from "./Window";

let chars: Partial<Character>[] = [
  { name: 'randPlayer', level: 1, class: CharacterClass.Warlock, guild: 'Slashers of the Night' },
  { name: 'anotherPlayer', level: 50, class: CharacterClass.Paladin, guild: 'Mount Olympus' },
  { name: 'PlayerThree', level: 1, class: CharacterClass.Magician, guild: 'Almost Decent' },
];

let groups: Group[] = [
  { leader: chars[0] as Character, characters: [chars[0] as Character], id: '1' },
  { leader: chars[1] as Character, characters: [chars[1] as Character], id: '2' },
  { leader: chars[2] as Character, characters: [chars[2] as Character], id: '3' },
];

function guildName(name?: string) {
  return name && name !== '' ? `(${name})` : '';
}

function GroupListing({ group }: { group: Group }) {
  return (<div className="flex flex-row flex-wrap w-full outline outline-1 bg-stone-700 hover:bg-stone-600">
    <div className="basis-1/12">{group.characters.length}/5</div>
    <div className="basis-2/12">Lv {group.leader.level}</div>
    <div className="basis-2/12">{group.leader.class}</div>
    <div className="flex-grow basis-4/12">{group.leader.name}{guildName(group.leader.guild)}</div>
  </div>);
}

function CharListing({ char }: { char: Character }) {
  return (<div className="px-1 w-full outline outline-1 bg-stone-700 hover:bg-stone-600">
    Lvl {char.level} {char.class} {char.name} {guildName(char.guild)}
  </div>)
}



export default function GroupsWindow() {
  const { closeWindow } = useWindow(UIWindow.Groups);

  return <Window tabbed close={() => closeWindow()}>
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
            {groups.length > 0 && groups.map(x => <GroupListing key={x.id} group={x} />)}
          </div>
          <hr className="py-3" />
          <div className="flex flex-row gap-x-5 place-content-center">
            <div className="flex flex-row gap-x-2">
              <img src="svg/iconRefresh.svg" />
              <label className="flex flex-row place-content-center items-center">
                <input type="checkbox" /><span className="px-1">All</span>
              </label>
            </div>
            <div>
              <button>Join Selected Group</button>
            </div>
          </div>
        </div>
      </Window.TabPanel>
      <Window.TabPanel>
        <div id="createGroup" className="flex flex-col text-sm p-1 h-48">
          <form className="flex-grow flex flex-col gap-y-2 self-center place-content-center">
            <label className="w-full flex flex-row gap-x-2 items-center">
              <span>Level Join Range:</span>
              <div className="w-12"><input defaultValue={5} /></div>
            </label>
            <label className="w-full flex flex-row gap-x-2">
              <input type="checkbox" defaultChecked={true} /><span>Auto Invite Others</span>
            </label>
            <label className="w-full flex flex-row gap-x-2">
              <input type="checkbox" /><span>Guild Only</span>
            </label>
          </form>
          <hr className="py-3" />
          <div className="flex place-content-center">
            <div>
              <button>Create Group</button>
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