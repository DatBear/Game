import { AttackType } from "./AttackType";
import Item, { ItemSubType } from "./Item";

export type Attack = {
  timestamp: number;
  sourceId: number;
  targetId: number;
  type: AttackType;
  damage: number;
  isCritical: boolean;
  targetHealthResult: number;
  weaponType: ItemSubType;

  weapon?: Item;
  xPlayer: number;
  yPlayer: number;
  xMob: number;
  yMob: number;

  isPlayer: boolean;
}