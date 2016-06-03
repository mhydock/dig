function TechnologyTree() {
    var self = this;
    
    function Technology(name, maxLevel, baseCost, visible, dependTech, dependLevel, costFunc) {
        var self = this;
        
        var _name = name;
        var _level = 0;
        var _maxLevel = maxLevel;
        var _baseCost = baseCost;
        var _currCost = baseCost;
        var _costFunc = costFunc;
        var _visible = visible;
        
        var _dependTech = dependTech ? dependTech : null;
        var _dependLevel = dependLevel ? dependLevel : 0;
        
        var _costListeners = new Listener();
        var _levelListeners = new Listener();
        var _visibleListeners = new Listener();
        
        function _checkDependencyLevel(level) {
            if (level == _dependLevel)
            {
                _visible = true;
                _visibleListeners.callAll(_visible);
            }
        }
        
        if (dependTech)
            dependTech.addLevelListener(_checkDependencyLevel);       
        
        function _calculateResearchCost() {
            if (typeof _costFunc === 'undefined' || _costFunc === null)
                return _baseCost * Math.pow(_level+1, 2);
                
            return _costFunc(_baseCost, _level+1);
        }              
        
        self.tryResearch = function(money) {
            if (money >= _currCost)
            {
                var cost = _currCost;
                _level++;
                
                _currCost = _calculateResearchCost();
                _costListeners.callAll(_currCost);
                _levelListeners.callAll(_level);
                
                return cost;
            }
            return -1;
        };
        
        self.getName = function() {
            return _name;
        };
        
        self.getLevel = function() {
            return _level;
        };
        
        self.getMaxLevel = function() {
            return _maxLevel;
        };
        
        self.getResearchCost = function() {
            return _currCost;
        };
        
        self.getVisibility = function() {
            return _visible;
        };
        
        self.addCostListener = function(func) {
            _costListeners.add(func);
        };
        
        self.addLevelListener = function(func) {
            _levelListeners.add(func);
        };
        
        self.addVisibilityListener = function(func) {
            _visibleListeners.add(func);
        };
    }
    
    var _shovel = new Technology('Shovels and Diggers',                  5, 100,    true,   null,   0);
    var _hammer = new Technology('Hammers and Picks',                    5, 500,    false,  _shovel, 1);
    var _drills = new Technology('Drills and Borers',                    5, 1000,   false,  _hammer, 1);
    var _water1 = new Technology('Low-Pressure Water-based Erosion',     5, 100,    false,  _shovel, 1);
    var _water2 = new Technology('High-pressure Water-based Erosion',    5, 1000,   false,  _water1, 2);
    var _explos = new Technology('Explosives',                           5, 1000,   false,  _hammer, 3);
    
    _tech = {
        'SHOVEL': _shovel,
        'HAMMER': _hammer,
        'DRILLS': _drills,
        'WATER1': _water1,
        'WATER2': _water2,
        'EXPLOS': _explos,
    };
    
    self.getTechnologies = function() {
        return _tech;
    };
}