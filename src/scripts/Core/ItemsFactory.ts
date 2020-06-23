namespace Core {
    export class ItemsFactory {

        constructor (private itemsInventory : ItemsInventory) {}

        produceListeners = new Listener();
        
        items = this.itemsInventory.Items;
        itemMap = [
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
            [
                
            ],
            [
                
            ],
            [
                
            ]
        ];
        
        produceItems(type : number) {
            type -= 1;      // Type/array offset
            
            if (type > this.itemMap.length)
                return;
            
            var chances = this.itemMap[type];
            for (var i in chances)
            {
                var result = chances[i].rollForItems();
                if (result !== null)
                {
                    this.produceListeners.callAll(result);
                    result.item.addMany(result.amount);
                }
            }
        }
        
        addProduceListener(func : ProduceListenerFunc) {
            return this.produceListeners.add(func);
        }
    }
}