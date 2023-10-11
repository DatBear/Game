import { Cell } from "./Cell";
import { Direction } from "./Direction";
import Mob from "./Mob";

export type Maze = {
  cells: Cell[][];
  position: { x: number, y: number, direction: Direction }
  mobs: Mob[];
}