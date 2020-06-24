import { log } from "../Core/Common";
import { Game } from "./Game";
import { GameGrid } from "./GameGrid";
import { ItemBox } from "./ItemBox";
import { TechBox } from "./TechBox";
import { TextGrid } from "./TextGrid";
import { ToolBox } from "./ToolBox";

function byId(id: string) {
  return document.getElementById(id);
}

export class Main {
  private game: Game;
  private grid: GameGrid;

  private wrapper: HTMLDivElement = byId("wrapper") as HTMLDivElement;
  private tooltip: HTMLDivElement = byId("tooltip") as HTMLDivElement;
  private gameScreen: HTMLDivElement = byId("gameScreen") as HTMLDivElement;
  private progCursor: HTMLDivElement = byId("progCursor") as HTMLDivElement;

  private moneyDiv: HTMLDivElement = byId("money") as HTMLDivElement;

  private toolsTab: HTMLLIElement = byId("tools") as HTMLLIElement;
  private itemsTab: HTMLLIElement = byId("items") as HTMLLIElement;
  private econTab: HTMLLIElement = byId("econ") as HTMLLIElement;
  private techTab: HTMLLIElement = byId("tech") as HTMLLIElement;
  private busiTab: HTMLLIElement = byId("busi") as HTMLLIElement;

  private toolBoxList: HTMLDivElement = byId("toolsList") as HTMLDivElement;
  private itemBoxList: HTMLDivElement = byId("itemsList") as HTMLDivElement;
  private econBoxList: HTMLDivElement = byId("econList") as HTMLDivElement;
  private techBoxList: HTMLDivElement = byId("techList") as HTMLDivElement;
  private busiBoxList: HTMLDivElement = byId("busiList") as HTMLDivElement;

  constructor() {
    log("Game has begun");
    this.game = new Game();
    this.grid = new TextGrid(this.game.Grid, this.game.Player, this.gameScreen);

    const tools = this.game.ToolsInventory.Tools;
    for (const t in tools) {
      const box = new ToolBox(this.game, tools[t]);
      this.toolBoxList.appendChild(box.ToolBox);
    }

    const items = this.game.ItemsInventory.Items;
    for (const i in items) {
      const box = new ItemBox(this.game, items[i]);
      this.itemBoxList.appendChild(box.ItemBox);
    }

    const techs = this.game.TechnologyTree.Technologies;
    for (const h in techs) {
      const box = new TechBox(this.game, techs[h]);
      this.techBoxList.appendChild(box.TechBox);
    }

    this.toolsTab.onclick = this.changeTab(this.toolsTab, this.toolBoxList);
    this.itemsTab.onclick = this.changeTab(this.itemsTab, this.itemBoxList);
    this.econTab.onclick = this.changeTab(this.econTab, this.econBoxList);
    this.techTab.onclick = this.changeTab(this.techTab, this.techBoxList);
    this.busiTab.onclick = this.changeTab(this.busiTab, this.busiBoxList);

    const fontSize = this.gameScreen.style.fontSize;
    const tileSize = Number(fontSize.substr(0, fontSize.length - 2)) || 16;
    this.grid.TileSize = tileSize;

    window.onresize = this.onResizeFunc;
    this.onResizeFunc();

    this.updateMoney(this.game.Money);
    this.game.addMoneyListener(this.updateMoney);

    this.gameScreen.onmousemove = this.updateHover;
    this.gameScreen.onmouseleave = this.hideTooltip;
    document.onkeydown = this.onKeyDownFunc;

    this.techTab.click();
    this.toolsTab.click();

    this.grid.render();
  }

  private updateMoney = (money: number) => {
    this.moneyDiv.textContent = "$ " + money;
  };

  private updateHover = (event: MouseEvent) => {
    const x = event.pageX - this.gameScreen.offsetLeft;
    const y = event.pageY - this.gameScreen.offsetTop;

    const hoverText = this.grid.getHoverText(x, y);
    if (hoverText === null) {
      this.tooltip.style.display = "none";
      return;
    }

    this.tooltip.innerHTML = hoverText;
    this.tooltip.style.top = event.pageY + 2 + "px";
    this.tooltip.style.left = event.pageX + 2 + "px";
    this.tooltip.style.display = "block";
  };

  private hideTooltip = () => {
    this.tooltip.style.display = "none";
  };

  private onResizeFunc = () => {
    this.wrapper.style.height = window.innerHeight + "px";
    this.grid.ViewRows = this.gameScreen.offsetHeight;
  };

  // keycodes found here http://www.javascriptkeycode.com/
  private onKeyDownFunc = (event: KeyboardEvent) => {
    if (event.which == 37)
      // left arrow
      this.game.moveLeft();
    if (event.which == 38)
      // up arrow
      this.game.moveUp();
    if (event.which == 39)
      // right arrow
      this.game.moveRight();
    if (event.which == 40)
      // down arrow
      this.game.moveDown();

    this.progCursor.style.top = this.game.Progress + "%";
    this.grid.render();
  };

  // this is safe only because `this` isn't being used
  private changeTab(tab: HTMLLIElement, list: HTMLDivElement) {
    return function() {
      log("doing a thing");
      const parent = tab.parentElement;
      const select = parent ? parent.querySelector(".selected") : null;
      if (select === tab) return;

      const grandP = parent ? parent.parentElement : null;
      const content = grandP ? grandP.querySelector(".content") : null;
      if (!content) return;

      for (const node of content.children) {
        (node as HTMLElement).style.display = "none";
      }
      list.style.display = "block";

      if (select) select.classList.remove("selected");

      tab.classList.add("selected");
    };
  }
}
