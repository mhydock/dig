function ItemsFactory(itemsInventory) {
    var self = this;
    
    function ItemChance(item, chance, minAmount, maxAmount) {
        var self = this;
        
        var _item = item;
        var _chance = chance;
        var _minAmount = minAmount > 0 ? minAmount : 1;
        var _maxAmount = maxAmount > minAmount ? maxAmount : minAmount;
        var _diff = _maxAmount - _minAmount;
        
        self.rollForItems = function() {
            var c = Math.random();
            if (c > _chance)
                return null;
                
            var a = Math.random();
            a = Math.round(a * _diff + _minAmount);
            
            log('Produced ' + a + ' items of type "' + _item.getName() + '"');
            
            return {'item': _item, 'amount': a};
        };
    }
    
    var _produceListeners = new Listener();
    
    var _items = itemsInventory.getItems();
    var _itemMap = [
        [
            new ItemChance(_items.CMDIRT, 1.0, 1, 10),
            new ItemChance(_items.GDDIRT, 0.5, 1, 5),
            new ItemChance(_items.TFCLAY, 0.4, 1, 5),
            new ItemChance(_items.SFCLAY, 0.2, 1, 2),
            new ItemChance(_items.SMSTNS, 0.1, 1, 3),
        ],
        [
            new ItemChance(_items.TFCLAY, 1.0, 1, 10),
            new ItemChance(_items.SFCLAY, 0.5, 1, 5),
            new ItemChance(_items.GRAVEL, 0.2, 1, 3),
            new ItemChance(_items.SMSTNS, 0.1, 1, 2),
            new ItemChance(_items.LGSTNS, 0.1, 1, 1),
        ],
        [
            new ItemChance(_items.GRAVEL, 1.0, 1, 10),
            new ItemChance(_items.TFCLAY, 0.4, 1, 5),
            new ItemChance(_items.SMSTNS, 0.3, 1, 3),
            new ItemChance(_items.LGSTNS, 0.1, 1, 2),
        ],
        [
            new ItemChance(_items.SMSTNS, 1.0, 1, 10),
            new ItemChance(_items.LGSTNS, 0.4, 1, 5),
            new ItemChance(_items.GRAVEL, 0.2, 1, 5),
            new ItemChance(_items.HGSTNS, 0.1, 1, 2),
        ],
        [
            new ItemChance(_items.LGSTNS, 1.0, 1, 10),
            new ItemChance(_items.SMSTNS, 0.4, 1, 10),
            new ItemChance(_items.HGSTNS, 0.4, 1, 5),
            new ItemChance(_items.GRAVEL, 0.1, 1, 3),
            new ItemChance(_items.BOULDR, 0.1, 1, 1),
        ],
        [
            
        ],
        [
            
        ],
        [
            
        ]
    ];
    
    self.produceItems = function(type) {
        type -= 1;      // Type/array offset
        
        if (type > _itemMap.length)
            return [];
        
        var results = [];
        var chances = _itemMap[type];
        for (var i in chances)
        {
            var result = chances[i].rollForItems();
            if (result !== null)
            {
                _produceListeners.callAll(result);
                result.item.addMany(result.amount);
            }
        }
    };
    
    self.addProduceListener = function(func) {
        return _produceListeners.add(func);
    };
}