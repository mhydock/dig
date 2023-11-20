import { debug } from "./Common";
import { Item } from "./Item";

export interface ItemPrize {
  item: Item;
  amount: number;
}
export interface ItemProducedListenerFunc {
  (prize: ItemPrize): void;
}

export class ItemChance {
  private diff: number;

  constructor(
    private item: Item,
    private chance: number,
    private minAmount: number,
    private maxAmount: number
  ) {
    minAmount =
      minAmount > 0 ? (minAmount < maxAmount ? minAmount : maxAmount) : 1;
    maxAmount = maxAmount > minAmount ? maxAmount : minAmount;
    this.diff = this.maxAmount - this.minAmount;
  }

  rollForItems(): ItemPrize | null {
    const c = Math.random();
    if (c > this.chance) return null;

    let a = Math.random();
    a = Math.round(a * this.diff + this.minAmount);

    debug("Produced " + a + ' items of type "' + this.item.Name + '"');

    return { item: this.item, amount: a };
  }
}
