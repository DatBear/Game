import { Zone } from "@/models/Zone";
import { Cell, generateMaze, Direction, Maze } from "@/utils/MazeGenerator";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useCharacter } from "../contexts/UserContext"
import { useHotkeys, isHotkeyPressed } from "react-hotkeys-hook"

const directions: Direction[] = [Direction.North, Direction.East, Direction.South, Direction.West];

export function Catacombs() {
  const { character, goToZone } = useCharacter();
  const [maze, setMaze] = useState<Maze>(generateMaze(30));

  useHotkeys('d', () => turnRight());
  useHotkeys('a', () => turnLeft());
  useHotkeys('s', () => turnAround());
  useHotkeys('w', () => moveForward());

  const turnRight = () => {
    if (!maze.position || (canMoveForward() && isHotkeyPressed('w'))) return;
    let currDir = directions.indexOf(maze.position.direction);
    maze.position.direction = currDir >= directions.length - 1 ? directions[0] : directions[currDir + 1];
    setMaze({ ...maze });
  }

  const turnLeft = () => {
    if (!maze.position || (canMoveForward() && isHotkeyPressed('w'))) return;
    let currDir = directions.indexOf(maze.position.direction);
    maze.position.direction = currDir <= 0 ? directions[directions.length - 1] : directions[currDir - 1];
    setMaze({ ...maze });
  }

  const turnAround = () => {
    if (!maze.position || (canMoveForward() && isHotkeyPressed('w'))) return;
    let currDir = directions.indexOf(maze.position.direction);
    maze.position.direction = currDir <= 1 ? maze.position.direction << 2 : maze.position.direction >> 2;
    setMaze({ ...maze });
  }

  const canMoveForward = () => {
    if (!maze.position || !maze.cells) return false;
    let cell = maze.cells[maze.position.y][maze.position.x];
    if ((cell.walls & maze.position.direction) > 0) return false;
    return true;
  }

  const moveForward = () => {
    if (!canMoveForward()) return;
    switch (maze.position.direction) {
      case Direction.North:
        maze.position.y -= 1;
        break;
      case Direction.East:
        maze.position.x += 1;
        break;
      case Direction.South:
        maze.position.y += 1;
        break;
      case Direction.West:
        maze.position.x -= 1;
        break;
    }
    maze.cells[maze.position.y][maze.position.x].visited = true;
    setMaze({ ...maze });
  }

  const regenerate = () => {
    const maze = generateMaze(30);
    console.log(maze.position);
    setMaze(maze);
  }

  const goToTown = () => {
    goToZone(Zone.Town);
  }

  return <div className="p-4">
    <button onClick={_ => goToTown()}>Back to Town</button>
    <button onClick={_ => regenerate()}>Refresh</button>
    <div className="pt-4">Catacombs</div>
    <div>
      {maze.cells && maze.cells.length > 0 && <MazeRenderer maze={maze} />}
    </div>
  </div>
}

const getWallClasses = function (wall: Direction) {
  const classes = [];
  (wall & Direction.North) > 0 && classes.push("border-t");
  (wall & Direction.East) > 0 && classes.push("border-r");
  (wall & Direction.South) > 0 && classes.push("border-b");
  (wall & Direction.West) > 0 && classes.push("border-l");
  return classes;
}


function MazeRenderer({ maze }: { maze: Maze }) {
  const className = clsx(`grid w-fit h-fit`);
  const gridTemplateColumns = `repeat(${maze.cells.length}, minmax(0,1fr))`;
  return <div className={className} style={{ gridTemplateColumns: gridTemplateColumns }}>
    {maze.cells.reverse().map(x => x.map(c => {
      let visitedBorder = c.visited ? "border-green-600" : "border-red-600";
      let visitedBg = !c.visited ? "bg-stone-900" : "bg-black";
      let className = clsx(`x-${c.x}`, `y-${c.y}`, 'w-5 h-5', getWallClasses(c.walls), visitedBorder, visitedBg);
      let isHere = maze.position.x === c.x && maze.position.y === c.y;
      let transform = `rotate(${directions.indexOf(maze.position.direction) * 90}deg)`;
      //console.log(transform);
      return <div key={`x-${c.x},y-${c.y}`} className={className}>
        {isHere && <img src="svg/iconMazePlayer.svg" className="w-4 h-4" alt="player" style={{ transform: transform }} />}
      </div>
    }))}
  </div>
}