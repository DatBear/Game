import { RefObject } from "react";
import Item from "./Item";

type Mob = {
  id: number;
  image: number;
  position: number;
  life: number;
  maxLife: number;
  damage: number[];
  ref: RefObject<HTMLImageElement>;
  weapon?: Item;
}

export default Mob;