import { useUser } from "../contexts/UserContext";

export default function Town() {
  const { user } = useUser();
  return <>
    {user.selectedCharacter && <div>Town!</div>}
  </>;
}