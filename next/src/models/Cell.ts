import { Direction } from "./Direction";

export type Cell = {
  walls: Direction;
  x: number;
  y: number;
  visited: boolean;
  //todo warm lights + trapdoors
}