import { ItemType, ItemSubType } from "./Item";
import { ItemStats } from "./Stats";

export type MarketSearchRequest = {
  type: ItemType;
  subType?: ItemSubType;
  tierRange: [number, number];
  magicLevel: [number, number];
  costRange: [number, number];
  attributes?: ItemStats[];
  usableOnly: boolean;
}