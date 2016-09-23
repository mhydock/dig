function Game() {
    var self = this;    
    
    var _grid = new Grid();
    var _player = new Player(_grid.getWidth()/2, -1);
    var _techTree = new TechnologyTree();
    var _tools = new ToolsInventory(_techTree);
    var _items = new ItemsInventory();
    var _itemFac = new ItemsFactory(_items);
    
    var _money = 0;    
    var _moneyListeners = new Listener();
    
    var _fontSize = 16;
    var _viewRows = 100;
    var _yOffset = 0;
    
    _player.setGrid(_grid);
    _player.setTools(_tools);
    _grid.setItemsFactory(_itemFac);
        
    function _getOrientationGlyph() {
        var orient = _player.getOrientation();
        
        if (orient == Orientation.NORTH)
            return '^';
        if (orient == Orientation.SOUTH)
            return 'v';
        if (orient == Orientation.EAST)
            return '>';
        if (orient == Orientation.WEST)
            return '<';
            
        return '';
    }
    
    function _getEmptyOrPlayer(x, y) {  
        if (y == _player.getY() && x == _player.getX())
            return _getOrientationGlyph();

        return '&nbsp;';
    }
    
    function _getBlockSprite(type) {
        if (type == 1)
            return '\u2593';
        if (type == 2)
            return '\u2592';
        if (type == 3)
            return '\u2591';
        if (type == 4)
            return '%';
        if (type == 5)
            return '#'; 
        if (type == 6) 
            return '=';
        if (type == 7)
            return '?';
        if (type == 8)
            return '&amp;';
    }
    
    function _getBlockTypePhrase(type) {
        if (type == 1)
            return '<label>Dirt</label><br/>';
        if (type == 2)
            return '<label>Clay</label><br/>';
        if (type == 3)
            return '<label>Gravel</label><br/>';
        if (type == 4)
            return '<label>Limestone</label><br/>';
        if (type == 5)
            return '<label>Sandstone</label><br/>';
        if (type == 6) 
            return '<label>Marble</label><br/>';
        if (type == 7)
            return '<label>Granite</label><br/>';
        if (type == 8)
            return '<label>Bedrock</label><br/>';
    }
    
    self.getToolsInventory = function() { return _tools; };
    
    self.getItemsInventory = function() { return _items; };
    
    self.getTechnologyTree = function() { return _techTree; };
    
    self.getPlayerPower = function() { return _tools.getPower(); };
    
    self.getHoverText = function(x, y) {
        // border offset (1px all sides)
        x -= 2;
        y -= 2;
        
        if (x < 0 || y < 0)
            return;
        
        var row = Math.floor(y/_fontSize);      // height of row == height of text
        var col = Math.floor(x/_fontSize*2);    // text half as wide as tall
        
        row += _yOffset;
        if (row == _player.getY() && col == _player.getX())
            return 'Power: ' + self.getPlayerPower();
        
        if (row < 0)
            return null;
            
        var health = _grid.getBlockHealthPercent(col,row);
        if (health === 0)
            return null;
            
        var type = _grid.getBlockType(row);
        var dura = _grid.getBlockDurability(row);
        
        var text = _getBlockTypePhrase(type);
        text += 'HP: ' + Math.ceil(health*dura) + '/' + dura;
        return text;
    };
    
    self.printVisibleGrid = function() {
        var maxRows = _viewRows;
        var maxSky = Math.ceil(maxRows/3);
        
        log('maxSky: ' + maxSky);
        
        var bottomRow = _player.getY() + Math.ceil(maxRows/2);
        if (bottomRow > _grid.getHeight()) bottomRow = _grid.getHeight();
        
        var sky = 0;
        var topRow = bottomRow - maxRows;
        if (topRow < 0)
        {
            sky = -topRow;
            topRow = 0;
            
            if (sky > maxSky)
            {
                sky = maxSky;
                bottomRow += sky;
            }
        }
        
        _yOffset = sky > 0 ? -sky : topRow;
        
        var i, j;
        var output = '';
        log("generating sky");
        for (i = 0; i < sky; i++)
        {
            for (j = 0; j < _grid.getWidth(); j++)
                output += _getEmptyOrPlayer(j, i-sky);
                
            output += '</br>';
        }              
        
        log("generating ground");
        for (i = topRow; i < bottomRow; i++)
        {
            var type = _grid.getBlockType(i);
            var dura = _grid.getBlockDurability(i);
                
            for (j = 0; j < _grid.getWidth(); j++)
            {
                if (_grid.isBlockCleared(j,i))
                    output += _getEmptyOrPlayer(j, i);
                else
                    output += _getBlockSprite(type);
            }
            output += '<br/>';
        }
        return output;
    };
    
    self.setFontSize = function(size) {
        _fontSize = size.substr(0, size.length-2);
        log('font size: ' + _fontSize);
    };
    
    self.setViewHeight = function(height) {        
        _viewRows = Math.ceil(height / _fontSize);
        
        log('view rows: ' + _viewRows);
    };
    
    self.getProgress = function() { 
        return Math.max(0, _player.getY()) / _grid.getHeight() * 100;
    };
    
    self.getMoney = function() {
        return _money;
    };
    
    self.addMoney = function(money) {
        _money += money;
        _moneyListeners.callAll(_money);
    };
    
    self.subMoney = function(money) {
        _money -= money;
        _moneyListeners.callAll(_money);
    };
    
    self.addMoneyListener = function(func) {
        return _moneyListeners.add(func);
    };
    
    self.moveUp = function() {
        _player.moveUp();
    };
    
    self.moveDown = function() {
        _player.moveDown();
    };
    
    self.moveLeft = function() {
        _player.moveLeft();
    };
    
    self.moveRight = function() {
        _player.moveRight();
    };
}