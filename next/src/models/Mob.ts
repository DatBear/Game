import Character from "./Character";
import { v4 as uuid } from "uuid";
import { createRef, RefObject } from "react";
import Item, { defaultItem, ItemSubType } from "./Item";

type Mob = {
  id: string;
  img: number;
  position: number;
  life: number;
  maxLife: number;
  damage: number[];
  ref: RefObject<HTMLImageElement>;
  weapon?: Item;
}

const generateMobs = (character: Character): Mob[] => {
  let mobs = rnd(2) + 1;
  let positions = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  return [...Array(mobs)].map(_ => ({
    id: uuid(),
    position: positions.splice(rnd(positions.length - 1), 1)[0],
    img: rnd(101),
    damage: [10, 20],
    life: 100,
    maxLife: 100,
    ref: createRef<HTMLImageElement>(),
    weapon: defaultItem(ItemSubType.Fire),
  }));
}

function rnd(max: number) {
  return Math.floor(Math.random() * max);
}

export { generateMobs }
export default Mob;