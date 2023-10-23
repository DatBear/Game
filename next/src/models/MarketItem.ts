import Item from "./Item";

type MarketItem = {
  id: number;
  userId: number;
  item: Item;
  price: number;
  expiresAt: number;
  isSold: boolean;
}

export default MarketItem;