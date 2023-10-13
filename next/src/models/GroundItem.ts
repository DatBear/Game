import Item from "./Item";

export type GroundItem = {
  item: Item;
  expiresTimestamp: number;
  hasGroupClicked: boolean;
  hasUserClicked: boolean;
}