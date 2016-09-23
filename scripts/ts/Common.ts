var printLogs = true;

function log (message) {
    if (printLogs)
        console.log(message);
}

function toDecimal(val, dec) {
    return Number(val).toString().match(/^\d+(?:\.\d{0,2})?/);
}

var Suffix = ['','k','m','b','t'];

function withSuffix(value) {
    if (value < 1000)
        return value;
    
    var suff;
    for (suff = 0; value >= 1000; suff++)
        value /= 1000;
                
    var text = value;
    if (suff > 0)
        text = toDecimal(value);        
    
    return text + Suffix[suff];
}

function Listener() {
    var self = this;
    
    var _listeners = {};
    var _listenerID = 0;
    
    self.add = function(func) {
        _listeners[_listenerID] = func;
        var id = _listenerID;
        _listenerID++;
        return id;
    };
    
    self.remove = function(id) {
        delete _listeners[id];
    };
    
    self.callAll = function() {
       for(var i in _listeners)
            if (_listeners.hasOwnProperty(i))
                _listeners[i].apply(this, arguments); 
    };
}

var Orientation = Object.freeze({NORTH: 1, EAST: 2, SOUTH: 3, WEST: 4});