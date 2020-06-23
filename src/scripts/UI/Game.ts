namespace UI {
    import log = Core.log;

    export class Game {

        private _techTree = new Core.TechnologyTree();
        private _tools = new Core.ToolsInventory(this._techTree);
        private _items = new Core.ItemsInventory();
        private _itemFac = new Core.ItemsFactory(this._items);

        private _grid = new Core.Grid(this._itemFac);
        private _player = new Core.Player(this._grid.Width/2, -1, this._grid, this._tools);

        private _money = 0;
        private _moneyListeners = new Core.Listener();

        constructor() { }

        get ToolsInventory() { return this._tools; }

        get ItemsInventory() { return this._items; }

        get TechnologyTree() { return this._techTree; }

        get Player() { return this._player; }

        get Grid() { return this._grid; }

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