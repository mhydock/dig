import { log } from "../Core/Common";
import { Game } from "../Core/Game";
import { GameGrid } from "./GameGrid";
import { TextGrid } from "./TextGrid";

function byId(id: string) {
  return document.getElementById(id);
}

export class Main {
  private grid: GameGrid;

  private tooltip: HTMLDivElement = byId("tooltip") as HTMLDivElement;
  private gameScreen: HTMLDivElement = byId("gameScreen") as HTMLDivElement;
  private progCursor: HTMLDivElement = byId("progCursor") as HTMLDivElement;

  private moneyDiv: HTMLDivElement = byId("money") as HTMLDivElement;

  constructor(private game: Game) {
    log("Game has begun");
    this.grid = new TextGrid(this.game.Grid, this.game.Player, this.gameScreen);

    const fontSize = getComputedStyle(this.gameScreen).fontSize;
    const tileSize = Number(fontSize.substr(0, fontSize.length - 2));
    this.grid.TileSize = tileSize;

    window.onresize = this.onResizeFunc;
    this.onResizeFunc();

    this.updateMoney(this.game.Money);
    this.game.addMoneyListener(this.updateMoney);

    this.gameScreen.onmousemove = this.updateHover;
    this.gameScreen.onmouseleave = this.hideTooltip;
    document.onkeydown = this.onKeyDownFunc;

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

    let offset =
      this.tooltip.getBoundingClientRect().height -
      (this.gameScreen.clientHeight - y);
    offset = offset >= 0 ? offset : 0;
    this.tooltip.innerHTML = hoverText;
    this.tooltip.style.top = event.pageY + 2 - offset + "px";
    this.tooltip.style.left = event.pageX + 2 + "px";
    this.tooltip.style.display = "block";
  };

  private hideTooltip = () => {
    this.tooltip.style.display = "none";
  };

  private onResizeFunc = () => {
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
}
