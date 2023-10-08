import Character, { CharacterClass, Gender } from "@/models/Character";
import { classArmors, classWeapons } from "@/models/Item";
import { clsx } from "clsx";
import { useEffect, useState } from "react";
import CharacterImage from "../CharacterImage";
import { useUser } from "../contexts/UserContext";
import ItemSlot from "../ItemSlot";
import { v4 as uuid } from "uuid";
import { listen } from "@/network/Socket";
import ResponsePacketType from "@/network/ResponsePacketType";
import { ListCharactersResponse } from "@/network/models/ListCharacters";

const classes = Object.keys(CharacterClass).filter((_, idx) => idx < 5);
const genders = Object.values(Gender).filter(x => typeof x == "number").map(x => x as Gender);
const defaultCharacter: Partial<Character> = {
  class: classes[0] as CharacterClass,
  gender: Gender.Male,
}

export default function CharacterSelect() {
  const { user, setCharacters } = useUser();
  const [showCreate, setShowCreate] = useState(user.characters.length === 0);

  useEffect(() => {
    return listen(ResponsePacketType.ListCharacters, (data: ListCharactersResponse) => {
      setCharacters(data);
      setShowCreate(data.length == 0);
    });
  }, []);

  if (user.selectedCharacter) {
    return <></>;
  }

  return (<div className="h-screen w-screen">
    {showCreate && <CharacterCreate showList={() => setShowCreate(false)} /> || <CharacterList characters={user.characters} showCreate={() => setShowCreate(true)} />}
  </div>)
}

function CharacterList({ characters, showCreate }: { characters: Character[], showCreate: () => void }) {
  const { selectCharacter } = useUser();
  const [selectedCharacter, setSelectedCharacter] = useState<Character>();

  return (<div className="h-full flex flex-row">
    <div className="flex flex-col bg-stone-800 w-min gap-2 p-1 h-full">
      {characters.map(x => {
        return <div key={x.name} onClick={_ => setSelectedCharacter(x)} className="bg-stone-600 flex flex-row gap-1">
          <div className="overflow-hidden">
            <div className="w-20 h-12 top-10 inline-block">
              <div className="w-24 h-48 relative" style={{ left: '-10%', top: '10%' }}>
                <CharacterImage character={x} className="" />
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <div>{x.name}</div>
            <div>Lv {x.level} {x.class}</div>
          </div>
        </div>
      })}
      <div>
        <button onClick={_ => showCreate()} className="w-max">Create New Character</button>
      </div>
    </div>
    {selectedCharacter && <div className="flex flex-col gap-4 items-center p-10">
      <div className="text-2xl">{selectedCharacter.name}</div>
      <div className="text-xl pb-5">Lv {selectedCharacter.level} {selectedCharacter.class}</div>
      <div className="w-48 h-96">
        <CharacterImage character={selectedCharacter} />
      </div>
      <div><button onClick={_ => selectCharacter(selectedCharacter)}>Play</button></div>
      {/* <div className="flex flex-row gap-4"><button>Reroll</button><button>Rename</button></div>
      <div><button>Delete</button></div> */}

    </div>}

  </div>);
}



function CharacterCreate({ showList }: { showList: () => void }) {
  const { user, createCharacter } = useUser();

  const [character, setCharacter] = useState<Partial<Character>>(defaultCharacter);

  const armors = classArmors[character.class as CharacterClass];
  const weapons = classWeapons[character.class as CharacterClass];

  const create = () => {
    if (!character.name || character.name == '') return;
    createCharacter({ ...character } as Character);
  }

  return (<div className="flex flex-col gap-y-3 w-min p-4 items-center">
    <div className="flex flex-col gap-y-4 w-fit items-center">
      <span>Create a New Character</span>
      <div className="flex flex-row gap-x-4">
        <label className="flex flex-row gap-x-2">
          <span className="w-max">Character Name:</span>
          <div><input value={(character.name ?? '')} onChange={e => setCharacter({ ...character, name: e.target.value })} /></div>
        </label>
        <label>
          <input type="checkbox" /> Hardcore
        </label>
      </div>
      <div className="flex flex-row gap-x-3">
        {genders.map(x => {
          var btnClasses = clsx(x === character.gender ? "!bg-stone-700 border-green-500/50" : "");
          return <button key={x} onClick={_ => setCharacter({ ...character, gender: x as Gender })} className={btnClasses}>{Gender[x]}</button>
        })}
      </div>
    </div>
    <div className="flex flex-row w-fit">
      <div className="flex flex-col gap-y-2">
        {classes.map(x => {
          let btnClasses = clsx(x == character.class ? "!bg-stone-700 border-green-500/50" : "");
          return <button key={x} onClick={_ => setCharacter({ ...character, class: x as CharacterClass })} className={btnClasses}>{x}</button>
        })}
      </div>
      <div className="p-4 w-48 h-96">
        <CharacterImage character={character} />
      </div>
      <div className="flex flex-col">
        <div className="w-max">Usable Weapons:</div>
        <div className="grid grid-cols-4 gap-1 w-max">
          {weapons.map(x => <ItemSlot key={x.toString()} item={{ id: uuid(), stats: { id: 0 }, subType: x, tier: 0 }} noDrag />)}
        </div>
        <div className="w-max">Usable Armors:</div>
        <div className="grid grid-cols-4 gap-1 w-max">
          {armors.map(x => <ItemSlot key={x.toString()} item={{ id: uuid(), stats: { id: 0 }, subType: x, tier: 0 }} noDrag />)}
        </div>
      </div>
    </div>
    <div className="flex flex-col w-fit gap-y-3 items-center">
      <span className="flex-shrink">Creating a character or using this game signifies that you have read and agree to the terms and conditions set forth in the Site Disclaimer. All characters and items are the property of datbear.com.</span>

      <div className="flex flex-row gap-x-3">
        <button onClick={_ => create()} className="w-max">Create Character</button>
        {user.characters.length > 0 && <button className="w-max" onClick={_ => showList()}>Cancel</button>}
      </div>
    </div>
  </div>);
}