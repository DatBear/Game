import { Zone } from "@/models/Zone";
import { useEffect } from "react";
import { useCharacter } from "../contexts/UserContext"

export function Catacombs() {
  const { character, goToZone } = useCharacter();

  useEffect(() => {

  }, []);

  const goToTown = () => {
    goToZone(Zone.Town);
  }

  return <div className="p-4">
    <button onClick={_ => goToTown()}>Back to Town</button>
    <div className="pt-4">Catacombs</div>
  </div>
}