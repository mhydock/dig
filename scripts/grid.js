function Grid() {
    var self = this;
    
    const BASE_DIGS_PER_UNIT_POWER = 2.0;
    const BASE_BLOCK_DURABILITY = 255;
    const BASE_POWER_MULTIPLIER = BASE_BLOCK_DURABILITY/BASE_DIGS_PER_UNIT_POWER;
    
    const WIDTH = 64;         // blocks/row
    const HEIGHT = 10240;     // rows
    
    var _buffer = new ArrayBuffer(WIDTH * HEIGHT);    // (width*height) bytes for blocks
    var _dataView = new Uint8Array(_buffer);          // 255 durability/block/row
    
    var _itemsFactory;
    var _blockClearedListeners = new Listener();
    
    // fill every block to maximum durability
    for (var i = 0; i < _dataView.length; i++)
        _dataView[i] = 0xff;

    self.getRow = function(y) {
        return _dataView.slice(y*WIDTH, (y+1)*WIDTH);
    };
    
    self.getWidth = function() {
        return WIDTH;
    };
    
    self.getHeight = function() {
        return HEIGHT;
    };
    
    self.getBlockDurability = function (depth) {
        return Math.ceil((depth * depth + 1)/100) * BASE_DIGS_PER_UNIT_POWER;
    };
    
    self.getBlockType = function(depth) {
        return Math.ceil(Math.log(self.getBlockDurability(depth)) / Math.LN10);
    };
    
    self.getBlockHealthPercent = function(x, y) {
        if (x < 0 || x > WIDTH-1 ||
            y < 0 || y > HEIGHT-1)
            return -1;
            
        return _dataView[y * WIDTH + x]/BASE_BLOCK_DURABILITY; 
    };
    
    self.isBlockCleared = function(x, y) {
        if (x < 0 || x > WIDTH-1 ||
            y < -1 || y > HEIGHT-1)
            return false;
        
        if (y == -1)
            return true;
        
        return _dataView[y * WIDTH + x] === 0;
    };
    
    self.dig = function(power, x, y) {
        if (x < 0 || x > WIDTH-1 ||
            y < -1 || y > HEIGHT-1)
            return -1;
            
        var index = y * WIDTH + x;
        var isTopClear = y === 0 ? true : _dataView[index - WIDTH] === 0;
        var isLeftClear = x === 0 ? false : _dataView[index - 1] === 0;
        var isRightClear = x === WIDTH-1 ? false : _dataView[index + 1] === 0;
        var isBottomClear = y === HEIGHT-1 ? false : _dataView[index + WIDTH] === 0;
        
        if (isTopClear || isLeftClear || isRightClear || isBottomClear)
        {
            var adjustedPower = Math.ceil(power * BASE_POWER_MULTIPLIER / self.getBlockDurability(y));
            var remainingDur = _dataView[index];
            _dataView[index] -= Math.min(remainingDur, adjustedPower);
            
            log('Caused ' + adjustedPower + ' damage to block [' + x + ',' + y +']');
            if (_dataView[index] === 0)
            {
                log('Block obliterated');
                var itemsProduced = _itemsFactory.produceItems(self.getBlockType(y));
                _blockClearedListeners.callAll(itemsProduced);
            }
               
            return adjustedPower;
        }
        
        return 0;        
    };
    
    self.setItemsFactory = function(itemsFactory) {
        _itemsFactory = itemsFactory;
    };
    
    self.addBlockClearedListener = function(func) {
        return _blockClearedListeners.add(func);
    };
}