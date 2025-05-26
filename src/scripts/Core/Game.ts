import { Grid } from "./Grid";
import { ItemsFactory } from "./ItemsFactory";
import { ItemsInventory } from "./ItemsInventory";
import { Player } from "./Player";
import { TechnologyTree } from "./TechnologyTree";
import { Tool } from "./Tool";
import { ToolsInventory } from "./ToolsInventory";

export class Game {
  private _techTree = new TechnologyTree();
  private _tools = new ToolsInventory(this._techTree);
  private _items = new ItemsInventory();
  private _itemFac = new ItemsFactory(this._items);

  private _grid = new Grid(this._itemFac);
  private _player = new Player(
    this._grid.Width / 2,
    -1,
    this._grid,
    this._tools,
  );

  private _money = 0;
  private _messages: string[] = [];

  constructor() {}

  get ToolsInventory() {
    return this._tools;
  }

  get ItemsInventory() {
    return this._items;
  }

  get TechnologyTree() {
    return this._techTree;
  }

  get Player() {
    return this._player;
  }

  get Grid() {
    return this._grid;
  }

  get Progress() {
    return (Math.max(0, this._player.Y) / this._grid.Height) * 100;
  }

  get Money() {
    return this._money;
  }

  get Messages() {
    return this._messages;
  }

  wireListeners() {
    // Can't wire up listeners in constructor, because the Game object isn't reactive yet.
    this._itemFac.addProduceListener((prize) => {
      this._messages.push(`Received ${prize.amount} ${prize.item.Name}(s)`);
    });
  }

  addMoney(money: number) {
    this._money += money;
  }

  subMoney(money: number) {
    this._money -= money;
  }

  moveUp() {
    this._player.moveUp();
  }

  moveDown() {
    this._player.moveDown();
  }

  moveLeft() {
    this._player.moveLeft();
  }

  moveRight() {
    this._player.moveRight();
  }

  tryDig() {
    this._player.dig();
  }

  selectTool(tool: Tool) {
    this.ToolsInventory.activeTool = tool;
  }

  clearMessages() {
    this._messages = [];
  }
}
