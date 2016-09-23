function ToolsInventory(techTree) {
    if (typeof techTree === 'undefined' || techTree === null)
        throw 'Tech Tree is undefined or null. Cannot create tools.';
    
    var self = this;
    
    function Tool(name, amount, power, baseCost, technology, level) {
        var self = this;
        
        var _amount = amount;
        var _power = power;
        var _baseCost = baseCost;
        var _name = name;
        var _technology = technology;
        var _minLevel = level;
        var _known = _amount > 0;
        
        var _buyCost;
        var _saleCost;
        var _saleMult = 0.75;

        var _amountListeners = new Listener();
        var _costListeners = new Listener();
        
        function _getCostForAmount (amount) {
            return _baseCost + Math.floor(amount*amount/4);
        }
        
        function _getBuyCost(amount) {
            return _getCostForAmount(_amount+1);
        }
        
        function _getSaleCost(amount) {
            return _getCostForAmount(_amount) * _saleMult;
        }
        
        _buyCost = _getBuyCost(_amount);
        _saleCost = _getSaleCost(_amount);
        
        self.tryBuy = function(money) {
            if (_technology.getLevel() < _minLevel)
                return -1;
                
            if (money >= _buyCost)
            {
                var cost = _buyCost;
                _amount++;
                
                _buyCost = _getBuyCost(_amount);
                _saleCost = _getSaleCost(_amount);
                _costListeners.callAll(_buyCost);
                _amountListeners.callAll(_amount);
                                       
                return cost;
            }
            return -1;
        };
        
        self.trySell = function() {
            //if (_technology.getLevel() < _minLevel)
                //return -1;
                
            if (_amount > 0)
            {
                var sale = _saleCost;
                _amount--;
                
                _buyCost = _getBuyCost(_amount);
                _saleCost = _getSaleCost(_amount);
                _costListeners.callAll(_buyCost);
                _amountListeners.callAll(_amount);
                        
                return sale;
            }
            return -1;
        };
        
        self.getBuyCost = function() {
            return _buyCost;
        };
        
        self.getSaleCost = function() {
            return _getCostForAmount(_amount) * 0.75;
        };
        
        self.addCostListener = function(func) {
            _costListeners.add(func);
        };
        
        self.getSaleMultiplier = function() {
            return _saleMult;
        };
        
        self.setSaleMultiplier = function(saleMult) {
            _saleMult = saleMult;
        };
        
        self.getAmount = function() {
            return _amount;
        };
        
        self.addAmountListener = function(func) {
            _amountListeners.add(func);
        };
        
        self.getTotalPower = function() {
            return _amount * _power;
        };
        
        self.getName = function() {
            return _name;
        };
        
        self.getTechnology = function() {
            return _technology;
        };
        
        self.getMinTechLevel = function() {
            return _minLevel;
        };
        
        self.isKnown = function() {
            return _known;
        };
    }
    
    var _tech = techTree.getTechnologies();
    var _tools = {
        'Trowel': new Tool('Trowel',                1, 1,      5            , _tech.SHOVEL, 0),
        'GdHose': new Tool('Garden Hose',           0, 2,      10           , _tech.WATER1, 1),
        'Shovel': new Tool('Shovel',                1, 4,      20           , _tech.SHOVEL, 1),
        'PickAx': new Tool('Pickaxe',               0, 30,     50           , _tech.HAMMER, 1),
        'Sledge': new Tool('Sledge Hammer',         0, 40,     100          , _tech.HAMMER, 2),
        'PrsWsh': new Tool('Pressure Washer',       0, 100,    300          , _tech.WATER2, 1),
        'FrHose': new Tool('Firehose',              0, 200,    200          , _tech.WATER1, 2),
        'JakHmr': new Tool('Jackhammer',            0, 200,    500          , _tech.HAMMER, 3),
        'SDrill': new Tool('Small Drill',           0, 400,    1200         , _tech.DRILLS, 1),     // well-boring drill
        'SXcvtr': new Tool('Small Excavator',       0, 1000,   25000        , _tech.SHOVEL, 2),     // small, Bobcat-esque excavator
        'HydMin': new Tool('Hydraulic Mining',      0, 2000,   5000         , _tech.WATER2, 2),
        'MDrill': new Tool('Medium Drill',          0, 4000,   10000        , _tech.DRILLS, 2),     // subway tunnel drill
        'MXcvtr': new Tool('Medium Excavator',      0, 8000,   150000       , _tech.SHOVEL, 3),     // small/medium construction excavator
        'Dynmte': new Tool('Dynamite',              0, 4000,   15000        , _tech.EXPLOS, 1),
        'LDrill': new Tool('Large Drill',           0, 10000,  500000       , _tech.DRILLS, 3),     // mountain tunnel drill
        'LXcvtr': new Tool('Large Excavator',       0, 20000,  300000       , _tech.SHOVEL, 4),     // large construction excavator
        'PolExp': new Tool('Polymer Explosives',    0, 40000,  150000       , _tech.EXPLOS, 2),
        'GDrill': new Tool('GIGA DRILL',            0, 100000, 80000000     , _tech.DRILLS, 4),     // Big Bertha, world's largest drill
        'Bagger': new Tool('GIANT EXCAVATOR',       0, 200000, 100000000    , _tech.SHOVEL, 5),     // Bagger 293, world's largest excavator
        'NukExp': new Tool('Nuclear Explosives',    0, 400000, 1000000000   , _tech.EXPLOS, 3)
    };
    
    self.getTools = function() { 
        return _tools;
    };
    
    self.getPower = function() {
        var total = 0; 
        for (var i in _tools)
        {
            if (_tools.hasOwnProperty(i))
                total += _tools[i].getTotalPower();
        }
        return total;
    };
    
    self.canMoveAndStep = function() { 
        return  _tools.Shovel.getAmount() > 0 ||
                _tools.SDrill.getAmount() > 0 ||
                _tools.LDrill.getAmount() > 0 ||
                _tools.GDrill.getAmount() > 0;
    };
}