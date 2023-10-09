import Character from "@/models/Character"
import ProgressBar from "./ProgressBar";
import CharacterImage from "./CharacterImage";
import { createRef } from "react";

export type CharacterDisplayProps = {
  character: Character | undefined | null;
}

export default function CharacterDisplay({ character }: CharacterDisplayProps) {

  if (character) {
    character.imageRef = createRef<HTMLDivElement>();
  }

  return <>
    {character && <div className="flex flex-row gap-2 h-24">
      <div className="flex flex-col w-24 text-xs gap-1">
        <div className="text-lg text-center">{character.name}</div>
        <ProgressBar current={character.life} max={character.stats.maxLife!} color={"red"} />
        <ProgressBar current={character.mana} max={character.stats.maxMana!} color={"blue"} />
        <ProgressBar current={character.experience - (character.level - 1) * 1000000} max={1000000} color={"green"} text={`Lv. ${character.level}`} />
      </div>
      <div className="w-12 h-24">
        <CharacterImage character={character} ref={character.imageRef} />
      </div>
    </div>}
  </>
}