function ItemsInventory() {
    var self = this;
    
    function Item(name, desc, amount, value, known) {
        var self = this;
        
        var _name = name;
        var _desc = desc;
        var _amount = amount;
        var _value = value;
        var _known = known;
        
        var _amountListeners = new Listener();
        var _knownListeners = new Listener();
        
        self.getName = function() {
            return _name;
        };
        
        self.getDescription = function() {
            return _desc;
        };
        
        self.getAmount = function() {
            return _amount;
        };
        
        self.getValue = function() {
            return _value;
        };
        
        self.getTotalValue = function() {
            return _amount * _value;
        };
        
        self.isKnown = function() {
            return _known;
        };
        
        self.add = function() {
            _amount++;
            _amountListeners.callAll(_amount);
            
            if (!_known)
            {
                _known = true;
                _knownListeners.callAll(true);
            }
        };
        
        self.addMany = function(amount) {
            _amount += amount;
            _amountListeners.callAll(_amount);
            
            if (!_known)
            {
                _known = true;
                _knownListeners.callAll(true);
            }
        };
        
        self.trySell = function() {
            if (_amount <= 0)
                return -1;
                
            _amount--;
            _amountListeners.callAll(_amount);
            return value;
        };
        
        self.trySellMany = function(amount) {
            if (_amount <= 0)
                return -1;
                
            _amount -= amount;
            _amountListeners.callAll(_amount);
            return _value * amount;
        };
        
        self.trySellAll = function() {
            if (_amount <= 0)
                return -1;
                
            var value = self.getTotalValue();
            _amount = 0;
            _amountListeners.callAll(_amount);
            return value;
        };
        
        self.addAmountListener = function(func) {
            return _amountListeners.add(func);
        };
        
        self.addKnownListener = function(func) {
            return _knownListeners.add(func);
        };
    }
    
    var _items = {
        'CMDIRT': new Item('Common Dirt',       'Just some dirt, no big deal.',                             0, 1,   true),
        'TFCLAY': new Item('Tough Clay',        'Tough clay, not good for much.',                           0, 2,   false),
        'GDDIRT': new Item('Quality Topsoil',   'The good stuff; great for gardens.',                       0, 3,   false),
        'SFCLAY': new Item('Soft Clay',         'Soft, smooth clay; great for ceramics.',                   0, 4,   false),
        'GRAVEL': new Item('Gravel',            'Tiny rocks, good for cheap driveways/parking lots.',       0, 5,   false),
        'SMSTNS': new Item('Small Stones',      'Small, smooth rocks. Would look nice in a garden.',        0, 10,  false),
        'LGSTNS': new Item('Large Stones',      'Large, heavy stones. Could have decorative uses?',         0, 25,  false),
        'HGSTNS': new Item('Huge Stones',       'Very large stones. Can probably be used in sculpture.',    0, 50,  false),
        'BOULDR': new Item('Boulder',           'A huge rock; not much you can do with it but break it.',   0, 100, false),
    };
    
    self.getItems = function() {
        return _items;
    };
}