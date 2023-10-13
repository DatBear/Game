import Character from "@/models/Character"
import ProgressBar from "./ProgressBar";
import CharacterImage from "./CharacterImage";
import { createRef } from "react";
import { useCharacter, useUser } from "./contexts/UserContext";
import clsx from "clsx";

export type CharacterDisplayProps = {
  character: Character | undefined | null;
  isGroupLeader: boolean;
}

export default function CharacterDisplay({ character, isGroupLeader }: CharacterDisplayProps) {

  const { user } = useUser();
  const { character: loggedInChar } = useCharacter();

  if (character) {
    character.imageRef = createRef<HTMLDivElement>();
  }

  const isDifferentZone = character && character.id !== loggedInChar.id && character.zone !== loggedInChar.zone;
  return <>
    {character && <div className="flex flex-row gap-2 h-24">
      <div className="flex flex-col w-24 text-xs gap-1">
        <div className="text-lg text-center">{isGroupLeader && "*"}{character.name}</div>
        <ProgressBar current={character.life} max={character.stats.maxLife!} color={"red"} />
        <ProgressBar current={character.mana} max={character.stats.maxMana!} color={"blue"} />
        <ProgressBar current={character.experience - (character.level - 1) * 1000000} max={1000000} color={"green"} text={`Lv. ${character.level}`} />
      </div>
      <div className={clsx("w-12 h-24", isDifferentZone && "opacity-40")}>
        <CharacterImage character={character} ref={character.imageRef} />
      </div>
    </div>}
  </>
}