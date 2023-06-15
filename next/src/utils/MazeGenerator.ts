
export enum Direction {
  North = 1,
  East = 2,
  South = 4,
  West = 8,
}

export type Cell = {
  walls: Direction;
  x: number;
  y: number;
  visited: boolean;
  //todo warm lights + trapdoors
}

export type Maze = {
  cells: Cell[][];
  position: { x: number, y: number, direction: Direction }
}

export function generateMaze(size: number): Maze {
  const cells: Cell[][] = [];
  for (var x = 0; x < size; x++) {
    cells.push([...Array(size)].map((_, y) => ({ walls: Direction.North | Direction.East | Direction.South | Direction.West, visited: false, x: y, y: x } as Cell)));
  }

  const stack: Cell[] = [];
  var x = rnd(size);
  var y = rnd(size);
  let first = cells[y][x];
  first.visited = true;
  stack.push(first);

  while (stack.length > 0) {
    let current = stack.pop();
    if (current == undefined) break;

    let neighbors = getNeighbors(current, cells);
    if (neighbors.length > 0) {
      var neighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
      stack.push(current);
      if (neighbor.x > current.x) {
        neighbor.walls &= ~Direction.West;
        current.walls &= ~Direction.East;
      } else if (neighbor.x < current.x) {
        neighbor.walls &= ~Direction.East;
        current.walls &= ~Direction.West;
      } else if (neighbor.y > current.y) {
        neighbor.walls &= ~Direction.North;
        current.walls &= ~Direction.South;
      } else if (neighbor.y < current.y) {
        neighbor.walls &= ~Direction.South;
        current.walls &= ~Direction.North;
      }
      neighbor.visited = true;
      stack.push(neighbor);
    }
  }

  for (var x = 0; x < cells.length; x++) {
    for (var y = 0; y < cells[x].length; y++) {
      cells[y][x].visited = false;
    }
  }

  let position = { x: rnd(size), y: rnd(size), direction: Direction.North };
  cells[position.y][position.x].visited = true;
  return { cells, position } as Maze;
}

function getNeighbors(cell: Cell, maze: Cell[][]) {
  var x = cell.x;
  var y = cell.y;
  var neighbors = [];
  if (x > 0) neighbors.push(maze[y][x - 1]);
  if (x < maze[0].length - 1) neighbors.push(maze[y][x + 1]);
  if (y > 0) neighbors.push(maze[y - 1][x]);
  if (y < maze.length - 1) neighbors.push(maze[y + 1][x]);
  return neighbors.filter(c => !c.visited);
}

function rnd(max: number) {
  return Math.floor(Math.random() * max);
}