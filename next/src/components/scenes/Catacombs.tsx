import { Zone } from "@/models/Zone";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { useCharacter, useUser } from "../contexts/UserContext"
import { useHotkeys } from "react-hotkeys-hook"
import ProgressBar from "../ProgressBar";
import Item, { defaultItem, ItemSubType } from "@/models/Item";
import { EquippedItemSlot } from "@/models/EquippedItem";
import ItemSlot from "../ItemSlot";
import { listen, send } from "@/network/Socket";
import RequestPacketType from "@/network/RequestPacketType";
import { Direction } from "@/models/Direction";
import { Maze } from "@/models/Maze";
import { MovementDirection } from "@/models/MovementDirection";
import { AttackType } from "@/models/AttackType";
import ResponsePacketType from "@/network/ResponsePacketType";
import { Attack } from "@/models/Attack";

const directions: Direction[] = [Direction.North, Direction.East, Direction.South, Direction.West];

type AttackRequest = {
  sourceId: number;
  targetId: number;
  type: AttackType;
  equippedItemSlot: EquippedItemSlot;
}

export function Catacombs() {
  const attackTimeout = useRef<NodeJS.Timer>();
  const { user } = useUser();
  const { character, goToZone, addExperience, addKill, addDeath } = useCharacter();
  const [areHotkeysEnabled, setAreHotkeysEnabled] = useState(true);
  const [target, setTarget] = useState<number>();
  const [lastAction, setLastAction] = useState(0);
  const [attacks, setAttacks] = useState<Attack[]>([]);

  const maze = user.group?.maze ?? user.maze!;
  const mobs = maze?.mobs;

  useHotkeys('d', e => !e.repeat && turnRight(), { enabled: areHotkeysEnabled, keyup: false });
  useHotkeys('a', e => !e.repeat && turnLeft(), { enabled: areHotkeysEnabled, keyup: false });
  useHotkeys('s', e => !e.repeat && turnAround(), { enabled: areHotkeysEnabled, keyup: false });
  useHotkeys('w', e => !e.repeat && moveForward(), { enabled: areHotkeysEnabled, keyup: false });

  const turnRight = () => {
    send(RequestPacketType.MoveDirection, MovementDirection.Right);
  }

  const turnLeft = () => {
    send(RequestPacketType.MoveDirection, MovementDirection.Left);
  }

  const turnAround = () => {
    send(RequestPacketType.MoveDirection, MovementDirection.TurnAround);
  }

  const moveForward = () => {
    send(RequestPacketType.MoveDirection, MovementDirection.Forward);
  }

  const goToTown = () => {
    setTarget(undefined);
    goToZone(Zone.Town);
  }

  const targetEnemy = (id: number) => {
    //console.log('set target ', id);
    setTarget(id);
    if (!attackTimeout.current) {
      attack(id);
    }
  }

  const attack = (forceTarget?: number) => {
    const targetId = forceTarget ?? target;
    if (!targetId) return;

    const mobTarget = mobs.find(x => x.id === targetId);
    if (!mobTarget) return;

    let attack: AttackRequest = {
      sourceId: user.selectedCharacter?.id!,
      targetId: targetId,
      type: AttackType.PlayerAttack,
      equippedItemSlot: EquippedItemSlot.Weapon,//todo change
    }
    send(RequestPacketType.AttackTarget, attack);
    setLastAction(new Date().getTime());
  };

  const randomPos = (el: HTMLElement) => {
    let x = el.offsetLeft + el.offsetWidth / 2 + rnd((el.offsetWidth ?? 0) * .3) * (rnd(1) == 1 ? -1 : 1);
    let y = el.offsetTop + el.offsetHeight / 2 + rnd((el.offsetHeight ?? 0) * .3) * (rnd(1) == 1 ? -1 : 1);
    return [x, y];
  };

  useEffect(() => {
    setAreHotkeysEnabled(mobs.length === 0);
  }, [mobs, setAreHotkeysEnabled]);

  useEffect(() => {
    let nextAction = 1000 - (new Date().getTime() - lastAction);
    //console.log('next', nextAction, lastAction);
    if (target) {
      if (nextAction < 0) {
        attack();
      } else {
        attackTimeout.current = setTimeout(attack, nextAction);
      }
    } else {
      clearTimeout(attackTimeout.current);
      attackTimeout.current = undefined;
    }

    return () => {
      if (attackTimeout.current) {
        clearTimeout(attackTimeout.current);
        attackTimeout.current = undefined;
      }
    }
  }, [attack, target]);

  useEffect(() => {
    return listen(ResponsePacketType.AttackTarget, (e: Attack) => {
      switch (e.type) {
        case AttackType.PlayerAttack:
          let source = user.group?.users.map(x => x.user?.selectedCharacter).find(x => x?.id === e.sourceId && x.imageRef) ?? user.selectedCharacter;
          let target = mobs.find(x => x.id === e.targetId);
          if (!source || !target || !target.ref) return;

          e.xSource = source?.imageRef.current?.offsetLeft! + source?.imageRef.current?.offsetWidth! * .8;
          e.ySource = source?.imageRef.current?.offsetTop! + source?.imageRef.current?.offsetHeight! * .5;

          [e.xTarget, e.yTarget] = randomPos(target?.ref.current!);
          e.weapon = e.weaponType != undefined ? defaultItem(e.weaponType) : undefined;
          e.isPlayer = true;

          setAttacks([...attacks.filter(x => new Date().getTime() < x.timestamp + 800 && x.timestamp != e.timestamp), e]);
          break;
        case AttackType.MobAttack:
          {
            let source = mobs.find(x => x.id === e.sourceId);
            let target = user.group?.users.map(x => x.user?.selectedCharacter).find(x => x?.id === e.targetId && x.imageRef) ?? user.selectedCharacter;
            if (!source || !target || !source.ref) return;
            e.xTarget = target?.imageRef.current?.offsetLeft! + target?.imageRef.current?.offsetWidth! * .8;
            e.yTarget = target?.imageRef.current?.offsetTop! + target?.imageRef.current?.offsetHeight! * .5;

            [e.xSource, e.ySource] = randomPos(source?.ref.current!);
            e.isPlayer = false;
            setAttacks([...attacks.filter(x => new Date().getTime() < x.timestamp + 800 && x.timestamp != e.timestamp), e]);
          }

      }
      //console.log('attack', e);
    });
  }, [user]);

  //console.log('render');
  return <>
    <div className="p-4 flex flex-col gap-3">
      <div className="flex flex-row gap-3">
        <button onClick={_ => goToTown()}>Back to Town</button>
      </div>

      <div className="flex flex-row">
        {mobs.length > 0 && <div className="grid grid-cols-3 gap-5 place-content-center w-fit h-fit">
          {[...Array(9)].map((_, idx) => {
            const mob = mobs.find(x => x.position === idx)
            if (!mob) return <div key={idx} className="w-48 h-48"></div>
            return mob && <div key={idx} className="w-48 h-48 flex flex-col gap-5" onClick={_ => targetEnemy(mob.id)}>
              <ProgressBar color="red" current={mob.life} max={mob.maxLife} text="Sweet Name" />
              <img src={`svg/mob${mob.image}.svg`} className="w-48 h-36 img-drop-shadow" ref={mob.ref} alt={"monster: Sweet Name"} />
            </div>
          })}
        </div>}
        {mobs.length == 0 && maze && maze.cells && maze.cells.length > 0 && <MazeRenderer maze={maze} />}
      </div>
    </div>
    <div className="absolute w-full h-full left-0 top-0" style={{ pointerEvents: "none" }}>
      {attacks.length > 0 && attacks.map(x => {
        switch (x.type) {
          case AttackType.PlayerAttack:
            {
              const left = x.xTarget + 'px';
              const top = x.yTarget + 'px';
              return <div key={x.timestamp} className="absolute w-10 h-10" style={{ left, top }}>
                <div className="flex flex-row items-center move-up fade-out">
                  {x.weapon && <ItemSlot medium noDrag noTooltip borderless noBackground item={x.weapon} />}
                  <div className="text-shadow text-2xl">{x.damage}{x.isCritical ? '!' : ''}</div>
                </div>
              </div>
            }
          case AttackType.MobAttack:
            {
              const left = x.xTarget + 'px';
              const top = x.yTarget + 'px';
              return <div key={x.timestamp} className="absolute w-10 h-10" style={{ left, top }}>
                <div className="flex flex-row items-center move-up fade-out">
                  {x.weapon && <ItemSlot medium noDrag noTooltip borderless noBackground item={x.weapon} />}
                  <div className="text-shadow text-2xl">{x.damage}{x.isCritical ? '!' : ''}</div>
                </div>
              </div>
            }
        }
        return <></>
      })}
    </div>
    <svg style={{ pointerEvents: "none", zIndex: -1 }} className="absolute w-full h-full left-0 top-0">
      {attacks.length > 0 && attacks.map(x => {
        return <line style={{ zIndex: -1 }} key={x.timestamp} x1={x.xSource} y1={x.ySource}
          x2={x.xTarget} y2={x.yTarget} stroke={"#FF0000"} strokeWidth="3" className="fade-out" />
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
    {maze.cells.map(x => x.map(c => {
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