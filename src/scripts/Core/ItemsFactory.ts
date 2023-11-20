import { ItemChance, ItemProducedListenerFunc } from "./ItemChance";
import { ItemsInventory, ItemsMap } from "./ItemsInventory";
import { Listener } from "./Listener";

export class ItemsFactory {
  produceListeners: Listener<ItemProducedListenerFunc>;
  items: ItemsMap;
  itemMap: (ItemChance[] | never[])[];

  constructor(private itemsInventory: ItemsInventory) {
    this.produceListeners = new Listener();

    this.items = this.itemsInventory.Items;
    this.itemMap = [
      [
        new ItemChance(this.items.CMDIRT, 1.0, 1, 10),
        new ItemChance(this.items.GDDIRT, 0.5, 1, 5),
        new ItemChance(this.items.TFCLAY, 0.4, 1, 5),
        new ItemChance(this.items.SFCLAY, 0.2, 1, 2),
        new ItemChance(this.items.SMSTNS, 0.1, 1, 3),
      ],
      [
        new ItemChance(this.items.TFCLAY, 1.0, 1, 10),
        new ItemChance(this.items.SFCLAY, 0.5, 1, 5),
        new ItemChance(this.items.GRAVEL, 0.2, 1, 3),
        new ItemChance(this.items.SMSTNS, 0.1, 1, 2),
        new ItemChance(this.items.LGSTNS, 0.1, 1, 1),
      ],
      [
        new ItemChance(this.items.GRAVEL, 1.0, 1, 10),
        new ItemChance(this.items.TFCLAY, 0.4, 1, 5),
        new ItemChance(this.items.SMSTNS, 0.3, 1, 3),
        new ItemChance(this.items.LGSTNS, 0.1, 1, 2),
      ],
      [
        new ItemChance(this.items.SMSTNS, 1.0, 1, 10),
        new ItemChance(this.items.LGSTNS, 0.4, 1, 5),
        new ItemChance(this.items.GRAVEL, 0.2, 1, 5),
        new ItemChance(this.items.HGSTNS, 0.1, 1, 2),
      ],
      [
        new ItemChance(this.items.LGSTNS, 1.0, 1, 10),
        new ItemChance(this.items.SMSTNS, 0.4, 1, 10),
        new ItemChance(this.items.HGSTNS, 0.4, 1, 5),
        new ItemChance(this.items.GRAVEL, 0.1, 1, 3),
        new ItemChance(this.items.BOULDR, 0.1, 1, 1),
      ],
      [],
      [],
      [],
    ];
  }

  produceItems(type: number) {
    if (type > this.itemMap.length) return;

    const chances = this.itemMap[type];
    for (const i in chances) {
      const result = chances[i].rollForItems();
      if (result !== null) {
        this.produceListeners.callAll(result);
        result.item.addMany(result.amount);
      }
    }
  }

  addProduceListener(func: ItemProducedListenerFunc) {
    return this.produceListeners.add(func);
  }
}
