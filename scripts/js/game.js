var Digdown;
(function (Digdown) {
    var Core;
    (function (Core) {
        let printLogs = true;
        function log(message) {
            if (printLogs)
                console.log(message);
        }
        Core.log = log;
        function toDecimal(val, dec) {
            return Number(val).toString().match(/^\d+(?:\.\d{0,2})?/)[0];
        }
        Core.toDecimal = toDecimal;
        var Suffix = ['', 'k', 'm', 'b', 't'];
        function withSuffix(value) {
            if (value < 1000)
                return value.toString();
            let suff;
            for (suff = 0; value >= 1000; suff++)
                value /= 1000;
            let text;
            if (suff > 0)
                text = toDecimal(value, 2);
            else
                text = value.toString();
            return text + Suffix[suff];
        }
        Core.withSuffix = withSuffix;
        let Orientation;
        (function (Orientation) {
            Orientation[Orientation["NORTH"] = 1] = "NORTH";
            Orientation[Orientation["EAST"] = 2] = "EAST";
            Orientation[Orientation["SOUTH"] = 3] = "SOUTH";
            Orientation[Orientation["WEST"] = 4] = "WEST";
        })(Orientation = Core.Orientation || (Core.Orientation = {}));
        ;
    })(Core = Digdown.Core || (Digdown.Core = {}));
})(Digdown || (Digdown = {}));
function log2(value) {
    return Math.log(value) / Math.log(2);
}
function log10(value) {
    return Math.log(value) / Math.log(10);
}
var Digdown;
(function (Digdown) {
    var Core;
    (function (Core) {
        const BASE_DIGS_PER_UNIT_POWER = 2.0;
        const BASE_BLOCK_DURABILITY = 255;
        const BASE_POWER_MULTIPLIER = BASE_BLOCK_DURABILITY / BASE_DIGS_PER_UNIT_POWER;
        const BLOCK_TYPE_PHRASE = [
            'Dirt',
            'Clay',
            'Gravel',
            'Limestone',
            'Sandstone',
            'Marble',
            'Granite',
            'Bedrock',
        ];
        let BlockType;
        (function (BlockType) {
            BlockType[BlockType["SDIRT"] = 1] = "SDIRT";
            BlockType[BlockType["MDIRT"] = 2] = "MDIRT";
            BlockType[BlockType["HDIRT"] = 3] = "HDIRT";
            BlockType[BlockType["BDROCK"] = 4] = "BDROCK";
        })(BlockType = Core.BlockType || (Core.BlockType = {}));
        class Block {
            constructor(depth, itemsFactory, blockClearedListener) {
                this.depth = depth;
                this.itemsFactory = itemsFactory;
                this.blockClearedListener = blockClearedListener;
                this.health = BASE_BLOCK_DURABILITY;
                this.durability = Math.ceil((depth * depth + 1) / 100) * BASE_DIGS_PER_UNIT_POWER;
                this.type = Math.ceil(Math.log(this.durability / Math.LN10));
            }
            dig(power, x, y) {
                let damage = Math.ceil(power * BASE_POWER_MULTIPLIER / this.durability);
                let remainingHP = this.health;
                this.health -= Math.min(remainingHP, damage);
                console.log('Caused ' + damage + ' damage to block [' + x + ',' + y + ']');
                if (this.health == 0) {
                    console.log('Block obliterated');
                    let itemsProduced = this.itemsFactory.produceItems(this.Type);
                    this.blockClearedListener.callAll(itemsProduced);
                }
                return damage;
            }
            get Type() {
                return this.type;
            }
            get TypePhrase() {
                return BLOCK_TYPE_PHRASE[this.type];
            }
            get Depth() {
                return this.depth;
            }
            get Health() {
                return this.health;
            }
            get IsCleared() {
                return this.health == 0;
            }
            get HealthPercent() {
                return this.health / BASE_BLOCK_DURABILITY;
            }
            get Durability() {
                return this.durability;
            }
        }
        Core.Block = Block;
    })(Core = Digdown.Core || (Digdown.Core = {}));
})(Digdown || (Digdown = {}));
/// <reference path='Block.ts'/>
var Digdown;
(function (Digdown) {
    var Core;
    (function (Core) {
        const WIDTH = 64; // blocks/row
        const HEIGHT = 10240; // rows
        class Grid {
            constructor() {
                this.grid = new Array(WIDTH * HEIGHT);
                this.blockClearedListeners = new Core.Listener();
            }
            get Width() { return WIDTH; }
            get Height() { return HEIGHT; }
            getRow(y) {
                return this.grid.slice(y * WIDTH, (y + 1) * WIDTH);
            }
            healthPercent(x, y) {
                let bl = this.block(x, y);
                if (bl != null)
                    return bl.HealthPercent;
                return -1;
            }
            isCleared(x, y) {
                let bl = this.block(x, y);
                if (bl != null)
                    return bl.IsCleared;
                return false;
            }
            block(x, y) {
                if (x >= 0 && x < WIDTH &&
                    y >= 0 && y < HEIGHT) {
                    let i = y * WIDTH + x;
                    if (this.grid[i] == null)
                        this.grid[i] = new Core.Block(y, this.itemsFactory, this.blockClearedListeners);
                    return this.grid[i];
                }
                return null;
            }
            blocks(coords) {
                let bl;
                let blocks = Array();
                for (let coord of coords) {
                    if ((bl = this.block(coord.x, coord.y)) != null)
                        blocks.push(bl);
                }
                return blocks;
            }
            addBlockClearedListener(func) {
                return this.blockClearedListeners.add(func);
            }
            ;
        }
        Core.Grid = Grid;
    })(Core = Digdown.Core || (Digdown.Core = {}));
})(Digdown || (Digdown = {}));
var Digdown;
(function (Digdown) {
    var Core;
    (function (Core) {
        class Player {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.orient = Core.Orientation.SOUTH;
            }
            step(x, y) {
                if (x < 0 || x >= this.grid.Width ||
                    y < -1 || y >= this.grid.Height)
                    return -1;
                Core.log('Attempting to move to [' + x + ',' + y + ']');
                // if player is above ground, just let them move.
                if (this.y == -1 && y == this.y) {
                    Core.log('Player is above ground');
                    this.x = x;
                    return 0;
                }
                if (this.grid.isCleared(x, y)) {
                    Core.log('Path is clear');
                    this.y = y;
                    this.x = x;
                    return -1;
                }
                else {
                    Core.log('Path is not clear');
                    var damage = this.tools.dig(this.grid, x, y, this.orient);
                    if (this.tools.canMoveAndStep() &&
                        this.grid.isCleared(x, y)) {
                        this.y = y;
                        this.x = x;
                    }
                    return damage;
                }
            }
            moveUp() {
                this.orient = Core.Orientation.NORTH;
                return this.step(this.x, this.y - 1);
            }
            moveDown() {
                this.orient = Core.Orientation.SOUTH;
                return this.step(this.x, this.y + 1);
            }
            moveLeft() {
                this.orient = Core.Orientation.WEST;
                return this.step(this.x - 1, this.y);
            }
            moveRight() {
                this.orient = Core.Orientation.EAST;
                return this.step(this.x + 1, this.y);
            }
            faceUp() {
                this.orient = Core.Orientation.NORTH;
            }
            faceDown() {
                this.orient = Core.Orientation.SOUTH;
            }
            faceLeft() {
                this.orient = Core.Orientation.WEST;
            }
            faceRight() {
                this.orient = Core.Orientation.EAST;
            }
            get X() {
                return this.x;
            }
            get Y() {
                return this.y;
            }
            get Orientation() {
                return this.orient;
            }
        }
        Core.Player = Player;
    })(Core = Digdown.Core || (Digdown.Core = {}));
})(Digdown || (Digdown = {}));
var Digdown;
(function (Digdown) {
    var Core;
    (function (Core) {
        class Listener {
            constructor() {
                this.listeners = {};
                this.listenerID = 0;
            }
            add(func) {
                this.listeners[this.listenerID] = func;
                let id = this.listenerID;
                this.listenerID++;
                return id;
            }
            remove(id) {
                delete this.listeners[id];
            }
            callAll(...args) {
                for (let i in this.listeners)
                    if (this.listeners.hasOwnProperty(i))
                        this.listeners[i].apply(this, args);
            }
        }
        Core.Listener = Listener;
    })(Core = Digdown.Core || (Digdown.Core = {}));
})(Digdown || (Digdown = {}));
/// <reference path='Listener.ts'/>
var Digdown;
(function (Digdown) {
    var Core;
    (function (Core) {
        class Technology {
            constructor(name, baseCost, visible, dependTech = null, dependLevel = 0, costFunc = Technology.defaultCostFunc) {
                this.name = name;
                this.baseCost = baseCost;
                this.visible = visible;
                this.dependTech = dependTech;
                this.dependLevel = dependLevel;
                this.costFunc = costFunc;
                this.level = 0;
                this.maxLevel = 10;
                this.costListeners = new Core.Listener();
                this.levelListeners = new Core.Listener();
                this.visibleListeners = new Core.Listener();
                this.checkDependencyLevel = (level) => {
                    if (level == this.dependLevel) {
                        this.visible = true;
                        this.visibleListeners.callAll(this.visible);
                    }
                };
                if (dependTech)
                    dependTech.addLevelListener(this.checkDependencyLevel);
                this.currCost = baseCost;
            }
            tryResearch(money) {
                if (money >= this.currCost) {
                    var cost = this.currCost;
                    this.level++;
                    this.currCost = this.costFunc(this.baseCost, this.level + 1);
                    this.costListeners.callAll(this.ResearchCost);
                    this.levelListeners.callAll(this.level);
                    return cost;
                }
                return -1;
            }
            get Name() {
                return this.name;
            }
            get Level() {
                return this.level;
            }
            get MaxLevel() {
                return this.maxLevel;
            }
            get ResearchCost() {
                return this.currCost;
            }
            get IsVisible() {
                return this.visible;
            }
            addCostListener(func) {
                this.costListeners.add(func);
            }
            addLevelListener(func) {
                this.levelListeners.add(func);
            }
            addVisibilityListener(func) {
                this.visibleListeners.add(func);
            }
        }
        Technology.defaultCostFunc = (baseCost, level) => baseCost * Math.pow(level + 1, 2);
        Core.Technology = Technology;
    })(Core = Digdown.Core || (Digdown.Core = {}));
})(Digdown || (Digdown = {}));
/// <reference path='Technology.ts'/>
var Digdown;
(function (Digdown) {
    var Core;
    (function (Core) {
        class TechnologyTree {
            constructor() {
                this.shovel = new Core.Technology('Shovels and Diggers', 100, true, null, 0);
                this.hammer = new Core.Technology('Hammers and Picks', 500, false, this.shovel, 1);
                this.drills = new Core.Technology('Drills and Borers', 1000, false, this.hammer, 1);
                this.water1 = new Core.Technology('Low-Pressure Water-based Erosion', 100, false, this.shovel, 1);
                this.water2 = new Core.Technology('High-pressure Water-based Erosion', 1000, false, this.water1, 2);
                this.explos = new Core.Technology('Explosives', 1000, false, this.hammer, 3);
                this.technologies = [this.shovel,
                    this.hammer,
                    this.drills,
                    this.water1,
                    this.water2,
                    this.explos];
            }
            get SHOVEL() { return this.shovel; }
            get HAMMER() { return this.hammer; }
            get DRILLS() { return this.drills; }
            get WATER1() { return this.water1; }
            get WATER2() { return this.water2; }
            get EXPLOS() { return this.explos; }
            get Technologies() {
                return this.technologies;
            }
        }
        Core.TechnologyTree = TechnologyTree;
    })(Core = Digdown.Core || (Digdown.Core = {}));
})(Digdown || (Digdown = {}));
/// <reference path='Grid.ts'/>
/// <reference path='TechnologyTree.ts'/>
var Digdown;
(function (Digdown) {
    var Core;
    (function (Core) {
        class ToolsInventory {
            constructor(techTree) {
                this.techTree = techTree;
                this.tools = {
                    'Trowel': new Core.Tool('Trowel', 1, 1, 5, this.techTree.SHOVEL, 1, 0),
                    'GdHose': new Core.Tool('Garden Hose', 0, 2, 10, this.techTree.WATER1, 1, 1),
                    'Shovel': new Core.Tool('Shovel', 1, 4, 20, this.techTree.SHOVEL, 1, 1),
                    'PickAx': new Core.Tool('Pickaxe', 0, 30, 50, this.techTree.HAMMER, 1, 1),
                    'Sledge': new Core.Tool('Sledge Hammer', 0, 40, 100, this.techTree.HAMMER, 1, 2),
                    'PrsWsh': new Core.Tool('Pressure Washer', 0, 100, 300, this.techTree.WATER2, 1, 1),
                    'FrHose': new Core.Tool('Firehose', 0, 200, 200, this.techTree.WATER1, 1, 2),
                    'JakHmr': new Core.Tool('Jackhammer', 0, 200, 500, this.techTree.HAMMER, 1, 3),
                    'SDrill': new Core.Tool('Small Drill', 0, 400, 1200, this.techTree.DRILLS, 1, 1),
                    'SXcvtr': new Core.Tool('Small Excavator', 0, 1000, 25000, this.techTree.SHOVEL, 1, 2),
                    'HydMin': new Core.Tool('Hydraulic Mining', 0, 2000, 5000, this.techTree.WATER2, 1, 2),
                    'MDrill': new Core.Tool('Medium Drill', 0, 4000, 10000, this.techTree.DRILLS, 1, 2),
                    'MXcvtr': new Core.Tool('Medium Excavator', 0, 8000, 150000, this.techTree.SHOVEL, 1, 3),
                    'Dynmte': new Core.Tool('Dynamite', 0, 4000, 15000, this.techTree.EXPLOS, 1, 1),
                    'LDrill': new Core.Tool('Large Drill', 0, 10000, 500000, this.techTree.DRILLS, 1, 3),
                    'LXcvtr': new Core.Tool('Large Excavator', 0, 20000, 300000, this.techTree.SHOVEL, 1, 4),
                    'PolExp': new Core.Tool('Polymer Explosives', 0, 40000, 150000, this.techTree.EXPLOS, 1, 2),
                    'GDrill': new Core.Tool('GIGA DRILL', 0, 100000, 80000000, this.techTree.DRILLS, 1, 4),
                    'Bagger': new Core.Tool('GIANT EXCAVATOR', 0, 200000, 100000000, this.techTree.SHOVEL, 1, 5),
                    'NukExp': new Core.Tool('Nuclear Explosives', 0, 400000, 1000000000, this.techTree.EXPLOS, 1, 3),
                };
                if (typeof techTree === 'undefined' || techTree == null)
                    throw 'Tech Tree is undefined or null. Cannot create tools.';
            }
            get Tools() {
                return this.tools;
            }
            get Power() {
                var total = 0;
                for (var i in this.tools) {
                    if (this.tools.hasOwnProperty(i))
                        total += this.tools[i].TotalPower;
                }
                return total;
            }
            canMoveAndStep() {
                return this.tools['Shovel'].Amount > 0 ||
                    this.tools['SDrill'].Amount > 0 ||
                    this.tools['LDrill'].Amount > 0 ||
                    this.tools['GDrill'].Amount > 0;
            }
            dig(grid, x, y, orient) {
                return 0;
            }
        }
        Core.ToolsInventory = ToolsInventory;
    })(Core = Digdown.Core || (Digdown.Core = {}));
})(Digdown || (Digdown = {}));
var Digdown;
(function (Digdown) {
    var Core;
    (function (Core) {
        class ItemsInventory {
            constructor() {
                this.items = {
                    'CMDIRT': new Core.Item('Common Dirt', 'Just some dirt, no big deal.', 0, 1, true),
                    'TFCLAY': new Core.Item('Tough Clay', 'Tough clay, not good for much.', 0, 2, false),
                    'GDDIRT': new Core.Item('Quality Topsoil', 'The good stuff; great for gardens.', 0, 3, false),
                    'SFCLAY': new Core.Item('Soft Clay', 'Soft, smooth clay; great for ceramics.', 0, 4, false),
                    'GRAVEL': new Core.Item('Gravel', 'Tiny rocks, good for cheap driveways/parking lots.', 0, 5, false),
                    'SMSTNS': new Core.Item('Small Stones', 'Small, smooth rocks. Would look nice in a garden.', 0, 10, false),
                    'LGSTNS': new Core.Item('Large Stones', 'Large, heavy stones. Could have decorative uses?', 0, 25, false),
                    'HGSTNS': new Core.Item('Huge Stones', 'Very large stones. Can probably be used in sculpture.', 0, 50, false),
                    'BOULDR': new Core.Item('Boulder', 'A huge rock; not much you can do with it but break it.', 0, 100, false),
                };
            }
            get Items() {
                return this.items;
            }
        }
        Core.ItemsInventory = ItemsInventory;
    })(Core = Digdown.Core || (Digdown.Core = {}));
})(Digdown || (Digdown = {}));
var Digdown;
(function (Digdown) {
    var Core;
    (function (Core) {
        class ItemsFactory {
            constructor(itemsInventory) {
                this.itemsInventory = itemsInventory;
                this.produceListeners = new Core.Listener();
                this.items = this.itemsInventory.Items;
                this.itemMap = [
                    [
                        new Core.ItemChance(this.items.CMDIRT, 1.0, 1, 10),
                        new Core.ItemChance(this.items.GDDIRT, 0.5, 1, 5),
                        new Core.ItemChance(this.items.TFCLAY, 0.4, 1, 5),
                        new Core.ItemChance(this.items.SFCLAY, 0.2, 1, 2),
                        new Core.ItemChance(this.items.SMSTNS, 0.1, 1, 3),
                    ],
                    [
                        new Core.ItemChance(this.items.TFCLAY, 1.0, 1, 10),
                        new Core.ItemChance(this.items.SFCLAY, 0.5, 1, 5),
                        new Core.ItemChance(this.items.GRAVEL, 0.2, 1, 3),
                        new Core.ItemChance(this.items.SMSTNS, 0.1, 1, 2),
                        new Core.ItemChance(this.items.LGSTNS, 0.1, 1, 1),
                    ],
                    [
                        new Core.ItemChance(this.items.GRAVEL, 1.0, 1, 10),
                        new Core.ItemChance(this.items.TFCLAY, 0.4, 1, 5),
                        new Core.ItemChance(this.items.SMSTNS, 0.3, 1, 3),
                        new Core.ItemChance(this.items.LGSTNS, 0.1, 1, 2),
                    ],
                    [
                        new Core.ItemChance(this.items.SMSTNS, 1.0, 1, 10),
                        new Core.ItemChance(this.items.LGSTNS, 0.4, 1, 5),
                        new Core.ItemChance(this.items.GRAVEL, 0.2, 1, 5),
                        new Core.ItemChance(this.items.HGSTNS, 0.1, 1, 2),
                    ],
                    [
                        new Core.ItemChance(this.items.LGSTNS, 1.0, 1, 10),
                        new Core.ItemChance(this.items.SMSTNS, 0.4, 1, 10),
                        new Core.ItemChance(this.items.HGSTNS, 0.4, 1, 5),
                        new Core.ItemChance(this.items.GRAVEL, 0.1, 1, 3),
                        new Core.ItemChance(this.items.BOULDR, 0.1, 1, 1),
                    ],
                    [],
                    [],
                    []
                ];
            }
            produceItems(type) {
                type -= 1; // Type/array offset
                if (type > this.itemMap.length)
                    return;
                var chances = this.itemMap[type];
                for (var i in chances) {
                    var result = chances[i].rollForItems();
                    if (result !== null) {
                        this.produceListeners.callAll(result);
                        result.item.addMany(result.amount);
                    }
                }
            }
            addProduceListener(func) {
                return this.produceListeners.add(func);
            }
        }
        Core.ItemsFactory = ItemsFactory;
    })(Core = Digdown.Core || (Digdown.Core = {}));
})(Digdown || (Digdown = {}));
/// <reference path='../Core/Common.ts'/>
/// <reference path='../Core/Grid.ts'/>
/// <reference path='../Core/Player.ts'/>
/// <reference path='../Core/TechnologyTree.ts'/>
/// <reference path='../Core/ToolsInventory.ts'/>
/// <reference path='../Core/ItemsInventory.ts'/>
/// <reference path='../Core/ItemsFactory.ts'/>
/// <reference path='../Core/ItemsFactory.ts'/>
var Digdown;
(function (Digdown) {
    var UI;
    (function (UI) {
        var log = Digdown.Core.log;
        var Orientation = Digdown.Core.Orientation;
        class Game {
            constructor() {
                this._grid = new Digdown.Core.Grid();
                this._player = new Digdown.Core.Player(this._grid.Width / 2, -1);
                this._techTree = new Digdown.Core.TechnologyTree();
                this._tools = new Digdown.Core.ToolsInventory(this._techTree);
                this._items = new Digdown.Core.ItemsInventory();
                this._itemFac = new Digdown.Core.ItemsFactory(this._items);
                this._money = 0;
                this._moneyListeners = new Digdown.Core.Listener();
                this._fontSize = 16;
                this._viewRows = 100;
                this._yOffset = 0;
                this._player.grid = this._grid;
                this._player.tools = this._tools;
                this._grid.itemsFactory = this._itemFac;
            }
            _getOrientationGlyph() {
                var orient = this._player.orient;
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
            _getEmptyOrPlayer(x, y) {
                if (y == this._player.Y && x == this._player.X)
                    return this._getOrientationGlyph();
                return '&nbsp;';
            }
            get ToolsInventory() { return this._tools; }
            ;
            get ItemsInventory() { return this._items; }
            ;
            get TechnologyTree() { return this._techTree; }
            ;
            get PlayerPower() { return this._tools.Power; }
            ;
            getHoverText(x, y) {
                // border offset (1px all sides)
                x -= 2;
                y -= 2;
                if (x < 0 || y < 0)
                    return null;
                var row = Math.floor(y / this._fontSize); // height of row == height of text
                var col = Math.floor(x / this._fontSize * 2); // text half as wide as tall
                row += this._yOffset;
                if (row == this._player.Y && col == this._player.X)
                    return 'Power: ' + this.PlayerPower;
                if (row < 0)
                    return null;
                var health = this._grid.healthPercent(col, row);
                if (health === 0)
                    return null;
                var block = this._grid.block(col, row);
                if (block === null)
                    return null;
                var type = block.Type;
                var dura = block.Durability;
                var text = `<label>${block.TypePhrase}</label><br/>`;
                text += 'HP: ' + Math.ceil(health * dura) + '/' + dura;
                return text;
            }
            ;
            printVisibleGrid() {
                var maxRows = this._viewRows;
                var maxSky = Math.ceil(maxRows / 3);
                log('maxSky: ' + maxSky);
                var bottomRow = this._player.Y + Math.ceil(maxRows / 2);
                if (bottomRow > this._grid.Height)
                    bottomRow = this._grid.Height;
                var sky = 0;
                var topRow = bottomRow - maxRows;
                if (topRow < 0) {
                    sky = -topRow;
                    topRow = 0;
                    if (sky > maxSky) {
                        sky = maxSky;
                        bottomRow += sky;
                    }
                }
                this._yOffset = sky > 0 ? -sky : topRow;
                var i, j;
                var output = '';
                log("generating sky");
                for (i = 0; i < sky; i++) {
                    for (j = 0; j < this._grid.Width; j++)
                        output += this._getEmptyOrPlayer(j, i - sky);
                    output += '</br>';
                }
                log("generating ground");
                for (i = topRow; i < bottomRow; i++) {
                    for (j = 0; j < this._grid.Width; j++) {
                        var block = this._grid.block(j, i);
                        if (block == null)
                            continue;
                        var type = block.Type;
                        var dura = block.Durability;
                        if (block.IsCleared)
                            output += this._getEmptyOrPlayer(j, i);
                        else
                            output += Game.SPRITE_LIST[type];
                    }
                    output += '<br/>';
                }
                return output;
            }
            ;
            setFontSize(size) {
                this._fontSize = Number(size.substr(0, size.length - 2)) || this._fontSize;
                log('font size: ' + this._fontSize);
            }
            ;
            setViewHeight(height) {
                this._viewRows = Math.ceil(height / this._fontSize);
                log('view rows: ' + this._viewRows);
            }
            ;
            get Progress() {
                return Math.max(0, this._player.Y) / this._grid.Height * 100;
            }
            ;
            get Money() {
                return this._money;
            }
            ;
            addMoney(money) {
                this._money += money;
                this._moneyListeners.callAll(this._money);
            }
            ;
            subMoney(money) {
                this._money -= money;
                this._moneyListeners.callAll(this._money);
            }
            ;
            addMoneyListener(func) {
                return this._moneyListeners.add(func);
            }
            ;
            moveUp() {
                this._player.moveUp();
            }
            ;
            moveDown() {
                this._player.moveDown();
            }
            ;
            moveLeft() {
                this._player.moveLeft();
            }
            ;
            moveRight() {
                this._player.moveRight();
            }
            ;
        }
        Game.SPRITE_LIST = [
            '\u2593',
            '\u2592',
            '\u2591',
            '%',
            '#',
            '=',
            '?',
            '&amp;',
        ];
        UI.Game = Game;
    })(UI = Digdown.UI || (Digdown.UI = {}));
})(Digdown || (Digdown = {}));
var Digdown;
(function (Digdown) {
    var Core;
    (function (Core) {
        class Item {
            constructor(name, desc, amount, value, known) {
                this.name = name;
                this.desc = desc;
                this.amount = amount;
                this.value = value;
                this.known = known;
                this.amountListeners = new Core.Listener();
                this.knownListeners = new Core.Listener();
            }
            get Name() {
                return this.name;
            }
            get Description() {
                return this.desc;
            }
            get Amount() {
                return this.amount;
            }
            get Value() {
                return this.value;
            }
            get TotalValue() {
                return this.amount * this.value;
            }
            get IsKnown() {
                return this.known;
            }
            add() {
                this.amount++;
                this.amountListeners.callAll(this.amount);
                if (!this.known) {
                    this.known = true;
                    this.knownListeners.callAll(true);
                }
            }
            addMany(amount) {
                this.amount += amount;
                this.amountListeners.callAll(this.amount);
                if (!this.known) {
                    this.known = true;
                    this.knownListeners.callAll(true);
                }
            }
            trySell() {
                if (this.amount <= 0)
                    return -1;
                this.amount--;
                this.amountListeners.callAll(this.amount);
                return this.value;
            }
            trySellMany(amount) {
                if (this.amount <= 0)
                    return -1;
                this.amount -= amount;
                this.amountListeners.callAll(this.amount);
                return this.value * amount;
            }
            trySellAll() {
                if (this.amount <= 0)
                    return -1;
                let value = this.TotalValue;
                this.amount = 0;
                this.amountListeners.callAll(this.amount);
                return value;
            }
            addAmountListener(func) {
                return this.amountListeners.add(func);
            }
            addKnownListener(func) {
                return this.knownListeners.add(func);
            }
        }
        Core.Item = Item;
    })(Core = Digdown.Core || (Digdown.Core = {}));
})(Digdown || (Digdown = {}));
/// <reference path='../Core/Common.ts'/>
/// <reference path='../Core/Item.ts'/>
var Digdown;
(function (Digdown) {
    var UI;
    (function (UI) {
        var log = Digdown.Core.log;
        var withSuffix = Digdown.Core.withSuffix;
        class ItemBox {
            constructor(game, item) {
                this.game = game;
                this.item = item;
                this.itemBox = document.createElement('div');
                this.title = document.createElement('h4');
                this.amountLbl = document.createElement('label');
                this.valueLbl = document.createElement('label');
                this.sellBtn = document.createElement('button');
                this.sell100Btn = document.createElement('button');
                this.sellAllBtn = document.createElement('button');
                this.clickSellButton = () => {
                    var sale = this.item.trySell();
                    if (sale >= 0)
                        this.game.addMoney(sale);
                    else
                        alert('You cannot sell that item');
                };
                this.clickSell100Button = () => {
                    var sale = this.item.trySellMany(100);
                    if (sale >= 0)
                        this.game.addMoney(sale);
                    else
                        alert('You cannot sell 100 of that item');
                };
                this.clickSellAllButton = () => {
                    var sale = this.item.trySellAll();
                    if (sale >= 0)
                        this.game.addMoney(sale);
                    else
                        alert('You cannot sell those items');
                };
                this.checkAmount = (amount) => {
                    this.sellBtn.disabled = amount <= 0;
                    this.sell100Btn.disabled = amount < 100;
                    if (amount < 100)
                        this.sell100Btn.style.display = 'none';
                    else
                        this.sell100Btn.style.display = 'block';
                    if (amount < 1000)
                        this.sellAllBtn.style.display = 'none';
                    else
                        this.sellAllBtn.style.display = 'block';
                    this.amountLbl.textContent = 'x ' + withSuffix(amount);
                    if (amount > 1000)
                        this.amountLbl.title = String(amount);
                    else
                        this.amountLbl.title = '';
                };
                this.checkKnown = (known) => {
                    if (known)
                        this.itemBox.style.display = 'block';
                    else
                        this.itemBox.style.display = 'none';
                };
                this.title.textContent = item.Name;
                this.amountLbl.textContent = 'x ' + item.Amount;
                this.valueLbl.textContent = '$ ' + item.Value + ' per';
                this.sellBtn.textContent = 'Sell';
                this.sell100Btn.textContent = 'Sell x100';
                this.sellAllBtn.textContent = 'Sell All';
                this.itemBox.title = item.Description;
                this.sellBtn.onclick = this.clickSellButton;
                this.sell100Btn.onclick = this.clickSell100Button;
                this.sellAllBtn.onclick = this.clickSellAllButton;
                this.checkKnown(item.IsKnown);
                this.checkAmount(item.Amount);
                item.addKnownListener(this.checkKnown);
                item.addAmountListener(this.checkAmount);
                this.itemBox.appendChild(this.title);
                this.itemBox.appendChild(this.amountLbl);
                this.itemBox.appendChild(this.valueLbl);
                this.itemBox.appendChild(this.sellBtn);
                this.itemBox.appendChild(this.sell100Btn);
                this.itemBox.appendChild(this.sellAllBtn);
            }
            get ItemBox() {
                return this.itemBox;
            }
        }
        UI.ItemBox = ItemBox;
    })(UI = Digdown.UI || (Digdown.UI = {}));
})(Digdown || (Digdown = {}));
/// <reference path='../Core/Common.ts'/>
var Digdown;
(function (Digdown) {
    var UI;
    (function (UI) {
        var log = Digdown.Core.log;
        class Main {
            constructor() {
                this.game = new UI.Game();
                this.wrapper = document.getElementById('wrapper');
                this.tooltip = document.getElementById('tooltip');
                this.gameScreen = document.getElementById('gameScreen');
                this.progCursor = document.getElementById('progCursor');
                this.moneyDiv = document.getElementById('money');
                this.toolsTab = document.getElementById('tools');
                this.itemsTab = document.getElementById('items');
                this.econTab = document.getElementById('econ');
                this.techTab = document.getElementById('tech');
                this.busiTab = document.getElementById('busi');
                this.toolBoxList = document.getElementById('toolsList');
                this.itemBoxList = document.getElementById('itemsList');
                this.econBoxList = document.getElementById('econList');
                this.techBoxList = document.getElementById('techList');
                this.busiBoxList = document.getElementById('busiList');
                this.updateMoney = (money) => {
                    this.moneyDiv.textContent = '$ ' + money;
                };
                this.updateHover = (event) => {
                    var x = event.pageX - this.gameScreen.offsetLeft;
                    var y = event.pageY - this.gameScreen.offsetTop;
                    var hoverText = this.game.getHoverText(x, y);
                    if (hoverText === null) {
                        this.tooltip.style.display = 'none';
                        return;
                    }
                    this.tooltip.innerHTML = this.game.getHoverText(x, y);
                    this.tooltip.style.top = (event.pageY + 2) + 'px';
                    this.tooltip.style.left = (event.pageX + 2) + 'px';
                    this.tooltip.style.display = 'block';
                };
                this.hideTooltip = () => {
                    this.tooltip.style.display = 'none';
                };
                this.onResizeFunc = () => {
                    this.wrapper.style.height = window.innerHeight + 'px';
                    this.game.setViewHeight(this.gameScreen.offsetHeight);
                };
                // keycodes found here http://www.javascriptkeycode.com/
                this.onKeyDownFunc = (event) => {
                    if (event.which == 37) // left arrow
                        this.game.moveLeft();
                    if (event.which == 38) // up arrow
                        this.game.moveUp();
                    if (event.which == 39) // right arrow
                        this.game.moveRight();
                    if (event.which == 40) // down arrow
                        this.game.moveDown();
                    this.gameScreen.innerHTML = this.game.printVisibleGrid();
                    this.progCursor.style.top = this.game.Progress + '%';
                };
                log("Game has begun");
                var tools = this.game.ToolsInventory.Tools;
                for (var t in tools) {
                    let box = new UI.ToolBox(this.game, tools[t]);
                    this.toolBoxList.appendChild(box.ToolBox);
                }
                var items = this.game.ItemsInventory.Items;
                for (var i in items) {
                    let box = new UI.ItemBox(this.game, items[i]);
                    this.itemBoxList.appendChild(box.ItemBox);
                }
                var techs = this.game.TechnologyTree.Technologies;
                for (var h in techs) {
                    let box = new UI.TechBox(this.game, techs[h]);
                    this.techBoxList.appendChild(box.TechBox);
                }
                this.toolsTab.onclick = this.changeTab(this.toolsTab, this.toolBoxList);
                this.itemsTab.onclick = this.changeTab(this.itemsTab, this.itemBoxList);
                this.econTab.onclick = this.changeTab(this.econTab, this.econBoxList);
                this.techTab.onclick = this.changeTab(this.techTab, this.techBoxList);
                this.busiTab.onclick = this.changeTab(this.busiTab, this.busiBoxList);
                this.game.setFontSize(this.gameScreen.style.fontSize);
                window.onresize = this.onResizeFunc;
                this.onResizeFunc();
                this.updateMoney(this.game.Money);
                this.game.addMoneyListener(this.updateMoney);
                this.gameScreen.onmousemove = this.updateHover;
                this.gameScreen.onmouseleave = this.hideTooltip;
                document.onkeydown = this.onKeyDownFunc;
                this.techTab.click();
                this.toolsTab.click();
                this.gameScreen.innerHTML = this.game.printVisibleGrid();
            }
            // this is safe only because `this` isn't being used
            changeTab(tab, list) {
                return function () {
                    log('doing a thing');
                    var parent = tab.parentElement;
                    var select = parent.querySelector('.selected');
                    if (select === tab)
                        return;
                    var content = parent.parentElement.querySelector('.content');
                    for (let node of content.children) {
                        node.style.display = 'none';
                    }
                    list.style.display = 'block';
                    if (select)
                        select.classList.remove('selected');
                    tab.classList.add('selected');
                };
            }
        }
        UI.Main = Main;
    })(UI = Digdown.UI || (Digdown.UI = {}));
})(Digdown || (Digdown = {}));
var Digdown;
(function (Digdown) {
    var UI;
    (function (UI) {
        var log = Digdown.Core.log;
        class TechBox {
            constructor(game, tech) {
                this.game = game;
                this.tech = tech;
                this.techBox = document.createElement('div');
                this.title = document.createElement('h3');
                this.levelLbl = document.createElement('label');
                this.resCostLbl = document.createElement('label');
                this.researchBtn = document.createElement('button');
                this.clickResearchButton = () => {
                    var cost = this.tech.tryResearch(this.game.Money);
                    if (cost >= 0)
                        this.game.subMoney(cost);
                    else
                        alert('You do not have enough money to research ' + this.tech.Name);
                };
                this.checkCost = (cost) => {
                    this.resCostLbl.textContent = 'Next: $ ' + cost;
                    if (cost > this.game.Money)
                        this.researchBtn.disabled = true;
                };
                this.checkMoney = (money) => {
                    if (money < this.tech.ResearchCost)
                        this.researchBtn.disabled = true;
                    else
                        this.researchBtn.disabled = false;
                };
                this.checkLevel = (level) => {
                    this.levelLbl.textContent = 'Level: ' + level;
                };
                this.checkVisibility = (visible) => {
                    if (visible)
                        this.techBox.style.display = 'block';
                    else
                        this.techBox.style.display = 'none';
                };
                this.title.textContent = tech.Name;
                this.researchBtn.textContent = 'Research';
                this.researchBtn.onclick = this.clickResearchButton;
                this.checkCost(tech.ResearchCost);
                this.checkLevel(tech.Level);
                this.checkVisibility(tech.IsVisible);
                tech.addCostListener(this.checkCost);
                tech.addLevelListener(this.checkLevel);
                tech.addVisibilityListener(this.checkVisibility);
                this.checkMoney(game.Money);
                game.addMoneyListener(this.checkMoney);
                this.techBox.appendChild(this.title);
                this.techBox.appendChild(this.levelLbl);
                this.techBox.appendChild(this.resCostLbl);
                this.techBox.appendChild(this.researchBtn);
            }
            get TechBox() {
                return this.techBox;
            }
        }
        UI.TechBox = TechBox;
    })(UI = Digdown.UI || (Digdown.UI = {}));
})(Digdown || (Digdown = {}));
/// <reference path='Technology.ts'/>
var Digdown;
(function (Digdown) {
    var Core;
    (function (Core) {
        class Tool {
            constructor(name, amount, power, baseCost, technology, workers, level, costFunc = Tool.defaultCostFunc) {
                this.name = name;
                this.amount = amount;
                this.power = power;
                this.baseCost = baseCost;
                this.technology = technology;
                this.workers = workers;
                this.level = level;
                this.costFunc = costFunc;
                this.amountListeners = new Core.Listener();
                this.costListeners = new Core.Listener();
                this.saleMult = 0.75;
                this.minLevel = this.level;
                if (amount > 0)
                    this.updateCosts(amount);
                else
                    this.buyCost = baseCost;
            }
            getCostForAmount(amount) {
                return this.costFunc(this.baseCost, amount);
            }
            getBuyCost(amount) {
                return this.getCostForAmount(amount + 1);
            }
            getSaleCost(amount) {
                return this.getCostForAmount(amount) * this.saleMult;
            }
            updateCosts(amount) {
                this.buyCost = this.getBuyCost(amount);
                this.saleCost = this.getSaleCost(amount);
            }
            tryBuy(money) {
                if (this.minLevel < this.technology.Level)
                    return -1;
                let cost = this.BuyCost;
                if (money >= cost) {
                    this.amount++;
                    this.buyCost = this.getBuyCost(this.amount);
                    this.saleCost = this.getSaleCost(this.amount);
                    this.costListeners.callAll(this.buyCost);
                    this.amountListeners.callAll(this.amount);
                    return cost;
                }
                return -1;
            }
            ;
            trySell() {
                //if (_minLevel < _technology.getLevel())
                //return -1;
                if (this.amount > 0) {
                    let sale = this.SaleCost;
                    this.amount--;
                    this.buyCost = this.getBuyCost(this.amount);
                    this.saleCost = this.getSaleCost(this.amount);
                    this.costListeners.callAll(this.buyCost);
                    this.amountListeners.callAll(this.amount);
                    return sale;
                }
                return -1;
            }
            ;
            addCostListener(func) {
                this.costListeners.add(func);
            }
            addAmountListener(func) {
                this.amountListeners.add(func);
            }
            get Name() {
                return this.name;
            }
            get Level() {
                return this.level;
            }
            get Amount() {
                return this.amount;
            }
            get Workers() {
                return this.workers;
            }
            get BuyCost() {
                return this.buyCost;
            }
            get SaleCost() {
                return this.saleCost;
            }
            get Technology() {
                return this.technology;
            }
            get MinTechLevel() {
                return this.minLevel;
            }
            get TotalPower() {
                return this.amount * this.power;
            }
            get IsKnown() {
                return this.amount > 0;
            }
        }
        Tool.defaultCostFunc = (baseCost, amount) => baseCost + Math.floor(amount * amount / 4);
        Core.Tool = Tool;
    })(Core = Digdown.Core || (Digdown.Core = {}));
})(Digdown || (Digdown = {}));
/// <reference path='../Core/Common.ts'/>
/// <reference path='../Core/Tool.ts'/>
var Digdown;
(function (Digdown) {
    var UI;
    (function (UI) {
        var withSuffix = Digdown.Core.withSuffix;
        class ToolBox {
            constructor(game, tool) {
                this.game = game;
                this.tool = tool;
                this.toolBox = document.createElement('div');
                this.title = document.createElement('h3');
                this.amountLbl = document.createElement('label');
                this.buyCostLbl = document.createElement('label');
                this.buyBtn = document.createElement('button');
                this.sellBtn = document.createElement('button');
                this.clickBuyButton = () => {
                    var cost = this.tool.tryBuy(this.game.Money);
                    if (cost >= 0)
                        this.game.subMoney(cost);
                    else
                        alert('You do not have enough money to buy a ' + this.tool.Name);
                };
                this.clickSellButton = () => {
                    var sale = this.tool.trySell();
                    if (sale >= 0)
                        this.game.addMoney(sale);
                    else
                        alert('You cannot sell that tool');
                };
                this.checkCost = (cost) => {
                    this.buyCostLbl.textContent = 'Next: $ ' + cost;
                    if (cost > this.game.Money)
                        this.buyBtn.disabled = true;
                };
                this.checkMoney = (money) => {
                    if (money < this.tool.BuyCost)
                        this.buyBtn.disabled = true;
                    else
                        this.buyBtn.disabled = false;
                };
                this.checkAmount = (amount) => {
                    this.sellBtn.disabled = amount <= 0;
                    this.amountLbl.textContent = 'x ' + withSuffix(amount);
                    if (amount > 1000)
                        this.amountLbl.title = String(amount);
                    else
                        this.amountLbl.title = '';
                };
                this.checkResearched = (level) => {
                    if (level >= this.tool.MinTechLevel || this.tool.IsKnown)
                        this.toolBox.style.display = 'block';
                    else
                        this.toolBox.style.display = 'none';
                };
                this.buyBtn.textContent = 'Buy';
                this.sellBtn.textContent = 'Sell';
                this.title.textContent = this.tool.Name;
                this.buyBtn.onclick = this.clickBuyButton;
                this.sellBtn.onclick = this.clickSellButton;
                this.checkCost(tool.BuyCost);
                this.checkAmount(tool.Amount);
                tool.addCostListener(this.checkCost);
                tool.addAmountListener(this.checkAmount);
                this.checkMoney(game.Money);
                game.addMoneyListener(this.checkMoney);
                var tech = tool.Technology;
                this.checkResearched(tech.Level);
                tech.addLevelListener(this.checkResearched);
                this.toolBox.appendChild(this.title);
                this.toolBox.appendChild(this.amountLbl);
                this.toolBox.appendChild(this.buyCostLbl);
                this.toolBox.appendChild(this.buyBtn);
                this.toolBox.appendChild(this.sellBtn);
            }
            get ToolBox() {
                return this.toolBox;
            }
        }
        UI.ToolBox = ToolBox;
    })(UI = Digdown.UI || (Digdown.UI = {}));
})(Digdown || (Digdown = {}));
var Digdown;
(function (Digdown) {
    var Core;
    (function (Core) {
        class ItemChance {
            constructor(item, chance, minAmount, maxAmount) {
                this.item = item;
                this.chance = chance;
                this.minAmount = minAmount;
                this.maxAmount = maxAmount;
                this.diff = this.maxAmount - this.minAmount;
                minAmount = minAmount > 0 ? minAmount < maxAmount ? minAmount : maxAmount : 1;
                maxAmount = maxAmount > minAmount ? maxAmount : minAmount;
            }
            rollForItems() {
                var c = Math.random();
                if (c > this.chance)
                    return null;
                var a = Math.random();
                a = Math.round(a * this.diff + this.minAmount);
                Core.log('Produced ' + a + ' items of type "' + this.item.Name + '"');
                return { 'item': this.item, 'amount': a };
            }
        }
        Core.ItemChance = ItemChance;
    })(Core = Digdown.Core || (Digdown.Core = {}));
})(Digdown || (Digdown = {}));

//# sourceMappingURL=../maps/game.js.map
