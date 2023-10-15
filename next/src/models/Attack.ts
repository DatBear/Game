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
  xSource: number;
  ySource: number;
  xTarget: number;
  yTarget: number;

  isPlayer: boolean;
}