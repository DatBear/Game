import { Zone } from "@/models/Zone";
import { Cell, generateMaze, Direction, Maze } from "@/utils/MazeGenerator";
import clsx from "clsx";
import { createRef, RefObject, useCallback, useEffect, useRef, useState } from "react";
import { useCharacter } from "../contexts/UserContext"
import { useHotkeys, isHotkeyPressed } from "react-hotkeys-hook"
import Mob, { generateMobs } from "@/models/Mob";
import ProgressBar from "../ProgressBar";
import Item, { ItemSubType } from "@/models/Item";
import { EquippedItemSlot } from "@/models/EquippedItem";
import ItemSlot from "../ItemSlot";

const directions: Direction[] = [Direction.North, Direction.East, Direction.South, Direction.West];

type Attack = {
  created: number;
  xPlayer: number;
  yPlayer: number;
  xMob: number;
  yMob: number;
  damage: number;
  isCritical: boolean;
  weapon?: Item;
  isPlayer: boolean;
}

export function Catacombs() {
  const attackInterval = useRef<NodeJS.Timer>();
  const { character, goToZone, addExperience, addKill, addDeath } = useCharacter();
  const [maze, setMaze] = useState<Maze>(generateMaze(30));
  const [areHotkeysEnabled, setAreHotkeysEnabled] = useState(true);
  const [mobs, setMobs] = useState<Mob[]>([]);
  const [target, setTarget] = useState<string>();
  const [attacks, setAttacks] = useState<Attack[]>([]);

  useHotkeys('d', () => turnRight(), { enabled: areHotkeysEnabled, keyup: false });
  useHotkeys('a', () => turnLeft(), { enabled: areHotkeysEnabled, keyup: false });
  useHotkeys('s', () => turnAround(), { enabled: areHotkeysEnabled, keyup: false });
  useHotkeys('w', () => moveForward(), { enabled: areHotkeysEnabled, keyup: false });

  useEffect(() => {
    const removeAttacksInterval = setInterval(() => {
      setAttacks(a => {
        return a.filter(x => new Date().getTime() < x.created + 800);
      });
    }, 50);

    return () => {
      if (attackInterval.current) {
        clearInterval(attackInterval.current);
        attackInterval.current = undefined;
      }
      clearInterval(removeAttacksInterval);
    }
  }, [setAttacks]);

  const turnRight = () => {
    if (!maze.position || (canMoveForward() && isHotkeyPressed('w'))) return;
    let currDir = directions.indexOf(maze.position.direction);
    maze.position.direction = currDir >= directions.length - 1 ? directions[0] : directions[currDir + 1];
    setMaze({ ...maze });
    maybeSpawnEnemy();
  }

  const turnLeft = () => {
    if (!maze.position || (canMoveForward() && isHotkeyPressed('w'))) return;
    let currDir = directions.indexOf(maze.position.direction);
    maze.position.direction = currDir <= 0 ? directions[directions.length - 1] : directions[currDir - 1];
    setMaze({ ...maze });
    maybeSpawnEnemy();
  }

  const turnAround = () => {
    if (!maze.position || (canMoveForward() && isHotkeyPressed('w'))) return;
    let currDir = directions.indexOf(maze.position.direction);
    maze.position.direction = currDir <= 1 ? maze.position.direction << 2 : maze.position.direction >> 2;
    setMaze({ ...maze });
    maybeSpawnEnemy();
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
    maybeSpawnEnemy();
  }

  const maybeSpawnEnemy = () => {
    if (Math.random() > .75) {
      const mobs = generateMobs(character);
      setMobs(mobs);
    }
  }

  useEffect(() => {
    setAreHotkeysEnabled(mobs.length === 0);
  }, [mobs, setAreHotkeysEnabled]);

  const targetEnemy = (id: string) => {
    //console.log('set target ', id);
    setTarget(id);
    if (!attackInterval.current) {
      attack(id);
    }
  }

  const attack = useCallback((forceTarget?: string) => {
    //console.log('attack ', target);
    const targetId = forceTarget ?? target;
    if (!targetId) return;
    const mobTarget = mobs.find(x => x.id === targetId);

    if (!mobTarget) return;

    var dmg = 25;//todo calc
    mobTarget.life = Math.max(0, mobTarget.life - dmg);
    if (mobTarget.life === 0) {
      addExperience(100000);//todo calc
      addKill();
      setTarget(undefined);
      setTimeout(() => {
        setMobs(mobs.filter(x => x.id !== mobTarget.id))
      }, 250);
    }

    const item = character.equippedItems.find(x => x.slot === EquippedItemSlot.Weapon)?.item;
    const attack = getAttack(character.imageRef, mobTarget.ref, dmg, Math.random() > .5, item, true);
    if (attack != null) {
      setAttacks(a => [...a, attack])
    }
  }, [target, mobs]);

  useEffect(() => {
    if (target) {
      attackInterval.current = setInterval(attack, 1000);//todo attack speed
    } else {
      clearInterval(attackInterval.current);
      attackInterval.current = undefined;
    }

    return () => {
      if (attackInterval.current) {
        clearInterval(attackInterval.current);
        attackInterval.current = undefined;
      }
    }
  }, [attack, target]);

  const getAttack = (player: RefObject<HTMLElement>, mob: RefObject<HTMLElement>, damage: number, isCritical: boolean, weapon: Item | undefined, isPlayer: boolean): Attack | null => {
    if (player.current == null || mob.current == null) return null;
    const xPlayer = player.current.offsetLeft + player.current.offsetWidth * .8;
    const yPlayer = player.current.offsetTop + player.current.offsetHeight * .5;

    const xOffset = rnd((mob.current.offsetWidth ?? 0) * .3) * (rnd(1) == 1 ? -1 : 1);
    const yOffset = rnd((mob.current.offsetHeight ?? 0) * .3) * (rnd(1) == 1 ? -1 : 1);
    const xMob = mob.current.offsetLeft + mob.current.offsetWidth * .5 + xOffset;
    const yMob = mob.current.offsetTop + mob.current.offsetHeight * .5 + yOffset;
    return {
      created: new Date().getTime(),
      xPlayer, yPlayer, xMob, yMob,
      damage, isCritical, weapon, isPlayer
    };
  }

  const regenerate = () => {
    const maze = generateMaze(30);
    setMaze(maze);
  }

  const goToTown = () => {
    setTarget(undefined);
    goToZone(Zone.Town);
  }

  return <>
    <div className="p-4 flex flex-col gap-3">
      <div className="flex flex-row gap-3">
        <button onClick={_ => goToTown()}>Back to Town</button>
        <button onClick={_ => regenerate()}>Refresh</button>
      </div>

      <div className="flex flex-row">
        {mobs.length > 0 && <div className="grid grid-cols-3 gap-5 place-content-center w-fit h-fit">
          {[...Array(9)].map((_, idx) => {
            const mob = mobs.find(x => x.position === idx)
            if (!mob) return <div key={idx} className="w-48 h-48"></div>
            return mob && <div key={mob.id} className="w-48 h-48 flex flex-col gap-5" onClick={_ => targetEnemy(mob.id)}>
              <ProgressBar color="red" current={mob.life} max={mob.maxLife} text="Sweet Name" />
              <img src={`svg/mob${mob.img}.svg`} className="w-full h-full img-drop-shadow" ref={mob.ref} />
            </div>
          })}
        </div>}
        {mobs.length == 0 && maze.cells && maze.cells.length > 0 && <MazeRenderer maze={maze} />}
      </div>
    </div>
    <div className="absolute w-full h-full left-0 top-0" style={{ pointerEvents: "none" }}>
      {attacks.length > 0 && attacks.map(x => {
        const left = (x.isPlayer ? x.xMob : x.xPlayer) + 'px';
        const top = (x.isPlayer ? x.yMob : x.yPlayer) + 'px';
        return x.isPlayer ? <div key={x.created} className="absolute w-10 h-10" style={{ left, top }}>
          <div className="flex flex-row items-center fade-out">
            {x.weapon && <ItemSlot medium noDrag noTooltip borderless noBackground item={x.weapon} />}
            <div className="text-shadow text-2xl">{x.damage}{x.isCritical ? '!' : ''}</div>
          </div>
        </div> : <></>
      })}
    </div>
    <svg style={{ pointerEvents: "none", zIndex: -1 }} className="absolute w-full h-full left-0 top-0">
      {attacks.length > 0 && attacks.map(x => {
        return <line style={{ zIndex: -1 }} key={x.created} x1={x.xPlayer} y1={x.yPlayer}
          x2={x.xMob} y2={x.yMob} stroke={"#FF0000"} strokeWidth="3" className="fade-out" />
      })}
    </svg>
  </>
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
      return <div key={`x-${c.x},y-${c.y}`} className={className}>
        {isHere && <img src="svg/iconMazePlayer.svg" className="w-4 h-4" alt="player" style={{ transform: transform }} />}
      </div>
    }))}
  </div>
}

function rnd(max: number) {
  return Math.round(Math.random() * max);
}