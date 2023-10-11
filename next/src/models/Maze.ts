import { Cell } from "./Cell";
import { Direction } from "./Direction";

export type Maze = {
  cells: Cell[][];
  position: { x: number, y: number, direction: Direction }
}