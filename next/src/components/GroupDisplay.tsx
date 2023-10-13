import { useUser } from "./contexts/UserContext"
import CharacterDisplay from "./CharacterDisplay"


export type GroupDisplayProps = {
}

export default function GroupDisplay() {
  const { user } = useUser();

  return <div className="flex flex-col gap-y-12 pt-12">
    {!user.group && <CharacterDisplay character={user.selectedCharacter} isGroupLeader={false} />}
    {user.group && user.group.users
      .sort(x => x && x.user?.id == user.id ? -1 : 1)
      .map(x => <CharacterDisplay key={x.user?.selectedCharacter?.id} character={x.user?.selectedCharacter} isGroupLeader={x.user?.id === user.group?.leaderId} />)}
  </div>
}