import Character from "@/models/Character"
import Group from "@/models/Group"
import ProgressBar from "./ProgressBar"
import CharacterImage from "./CharacterImage"
import { useCharacter, useUser } from "./contexts/UserContext"
import { createRef } from "react"
import CharacterDisplay from "./CharacterDisplay"


export type GroupDisplayProps = {
}

export default function GroupDisplay() {
  const { user } = useUser();

  return <div className="flex flex-col gap-y-12 pt-12">
    <CharacterDisplay character={user.selectedCharacter} />
    {user.group && user.group.users
      .filter(x => x && x.user?.id !== user.id && x.user?.selectedCharacter?.id !== user.selectedCharacter?.id)
      .map(x => x.user?.selectedCharacter)
      .map(x => <CharacterDisplay key={x?.id} character={x} />)}
  </div>
}