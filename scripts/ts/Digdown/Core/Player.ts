function Player(x, y) {
    var self = this;
    
    var _x = x;
    var _y = y;
    var _orient = Orientation.SOUTH;

    var _grid;
    var _tools;    

    function _step(x, y) {
        if (x < 0 || x >= _grid.getWidth() ||
            y < -1 || y >= _grid.getHeight())
            return -1;
        
        log('Attempting to move to [' + x + ',' + y + ']');

        // if player is above ground, just let them move.
        if (_y == -1 && y == _y)
        {
            log('Player is above ground');
            _x = x;
            return;            
        }
            
        if (_grid.isBlockCleared(x, y))
        {
            log('Path is clear');
            _y = y;
            _x = x;
            return -1;            
        }
        else
        {
            log('Path is not clear');
            var damage = _grid.dig(_tools.getPower(), x, y);
            
            if (_tools.canMoveAndStep() && _grid.isBlockCleared(x,y))
            {
                _y = y;
                _x = x;
            }
            
            return damage;   
        }
    }
    
    self.moveUp = function() {
        _orient = Orientation.NORTH;
        return _step(_x, _y-1);
    };
    
    self.moveDown = function() {
        _orient = Orientation.SOUTH;
        return _step(_x, _y+1);
    };
    
    self.moveLeft = function() {
        _orient = Orientation.WEST;
        return _step(_x-1, _y);
    };
    
    self.moveRight = function() {
        _orient = Orientation.EAST;
        return _step(_x+1, _y);
    };
    
    self.getOrientation = function() {
        return _orient;
    };
    
    self.setGrid = function(grid) {
        _grid = grid;
    };
    
    self.setTools = function(tools) {
        _tools = tools;
    };
    
    self.getX = function() {
        return _x;
    };
    
    self.getY = function() {
        return _y;
    };
}