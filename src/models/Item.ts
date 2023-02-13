
enum ItemType {

}

enum ItemSubType {

}

type Item = {
  tier: number;
  quantity?: number;
  type: ItemType;
  subType: ItemSubType;
}

export default Item;