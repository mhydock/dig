/// <reference path='../Core/Common.ts'/>
/// <reference path='../Core/Grid.ts'/>
/// <reference path='../Core/Player.ts'/>
/// <reference path='../Core/TechnologyTree.ts'/>
/// <reference path='../Core/ToolsInventory.ts'/>
/// <reference path='../Core/ItemsInventory.ts'/>
/// <reference path='../Core/ItemsFactory.ts'/>
/// <reference path='../Core/ItemsFactory.ts'/>

namespace Digdown.UI {
    import log = Core.log;
    import Orientation = Core.Orientation;

    export class Game {
        private static SPRITE_LIST = [
            '\u2593',
            '\u2592',
            '\u2591',
            '%',
            '#',
            '=',
            '?',
            '&amp;',
        ];

        private _grid = new Core.Grid();
        private _player = new Core.Player(this._grid.Width/2, -1);
        private _techTree = new Core.TechnologyTree();
        private _tools = new Core.ToolsInventory(this._techTree);
        private _items = new Core.ItemsInventory();
        private _itemFac = new Core.ItemsFactory(this._items);

        private _money = 0;    
        private _moneyListeners = new Core.Listener();

        private _fontSize = 16;
        private _viewRows = 100;
        private _yOffset = 0;
        
        constructor() {
            this._player.grid = this._grid;
            this._player.tools = this._tools;
            this._grid.itemsFactory = this._itemFac;
        }

        private _getOrientationGlyph() : string {
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
        
        private _getEmptyOrPlayer(x: number, y: number) : string {  
            if (y == this._player.Y && x == this._player.X)
                return this._getOrientationGlyph();

            return '&nbsp;';
        }
        
        get ToolsInventory() { return this._tools; };
    
        get ItemsInventory() { return this._items; };
    
        get TechnologyTree() { return this._techTree; };
    
        get PlayerPower() { return this._tools.Power; };
    
        getHoverText(x: number, y: number) : string {
            // border offset (1px all sides)
            x -= 2;
            y -= 2;
            
            if (x < 0 || y < 0)
                return null;
            
            var row = Math.floor(y/this._fontSize);      // height of row == height of text
            var col = Math.floor(x/this._fontSize*2);    // text half as wide as tall
            
            row += this._yOffset;
            if (row == this._player.Y && col == this._player.X)
                return 'Power: ' + this.PlayerPower;
            
            if (row < 0)
                return null;
                
            var health = this._grid.healthPercent(col,row);
            if (health === 0)
                return null;
            
            var block = this._grid.block(col, row);
            if (block === null)
                return null;

            var type = block.Type;
            var dura = block.Durability;
            
            var text = `<label>${block.TypePhrase}</label><br/>`;
            text += 'HP: ' + Math.ceil(health*dura) + '/' + dura;
            return text;
        };
        
        printVisibleGrid() : string {
            var maxRows = this._viewRows;
            var maxSky = Math.ceil(maxRows/3);
            
            log('maxSky: ' + maxSky);
            
            var bottomRow = this._player.Y + Math.ceil(maxRows/2);
            if (bottomRow > this._grid.Height) bottomRow = this._grid.Height;
            
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
            
            this._yOffset = sky > 0 ? -sky : topRow;
            
            var i, j;
            var output = '';
            log("generating sky");
            for (i = 0; i < sky; i++)
            {
                for (j = 0; j < this._grid.Width; j++)
                    output += this._getEmptyOrPlayer(j, i-sky);
                    
                output += '</br>';
            }              
            
            log("generating ground");
            for (i = topRow; i < bottomRow; i++)
            { 
                for (j = 0; j < this._grid.Width; j++)
                {
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
        };
        
        setFontSize(size: string) {
            this._fontSize = Number(size.substr(0, size.length-2)) || this._fontSize;
            log('font size: ' + this._fontSize);
        };
        
        setViewHeight(height: number) {        
            this._viewRows = Math.ceil(height / this._fontSize);
            
            log('view rows: ' + this._viewRows);
        };
        
        get Progress() { 
            return Math.max(0, this._player.Y) / this._grid.Height * 100;
        };
        
        get Money() {
            return this._money;
        };
        
        addMoney(money: number) {
            this._money += money;
            this._moneyListeners.callAll(this._money);
        };
        
        subMoney(money: number) {
            this._money -= money;
            this._moneyListeners.callAll(this._money);
        };
        
        addMoneyListener(func: Function) {
            return this._moneyListeners.add(func);
        };
        
        moveUp() {
            this._player.moveUp();
        };
        
        moveDown() {
            this._player.moveDown();
        };
        
        moveLeft() {
            this._player.moveLeft();
        };
        
        moveRight() {
            this._player.moveRight();
        };
    }
}