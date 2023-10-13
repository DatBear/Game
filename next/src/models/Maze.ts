import { Cell } from "./Cell";
import { Direction } from "./Direction";
import { GroundItem } from "./GroundItem";
import Mob from "./Mob";

export type Maze = {
  cells: Cell[][];
  position: { x: number, y: number, direction: Direction }
  mobs: Mob[];
  items: GroundItem[];
}