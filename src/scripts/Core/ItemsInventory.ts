import itemsTemplates from "../../assets/items.json";
import { Item } from "./Item";

export type ItemsMap = {
  [key: string]: Item;
};

export class ItemsInventory {
  private items: ItemsMap = {};

  constructor() {
    itemsTemplates.forEach((i) => {
      const item = new Item(i.name, i.desc, i.amount, i.value, i.known);
      this.items[i.id] = item;
    });
  }

  get Items() {
    return this.items;
  }
}
