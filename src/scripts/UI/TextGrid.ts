import { log, Orientation } from "../Core/Common";
import { Grid } from "../Core/Grid";
import { Player } from "../Core/Player";
import { GameGrid } from "./GameGrid";

export class TextGrid implements GameGrid {
  private static SPRITE_LIST = [
    "\u2593",
    "\u2592",
    "\u2591",
    "%",
    "#",
    "=",
    "?",
    "&amp;"
  ];

  private gameGrid: Grid;
  private player: Player;
  private screen: HTMLDivElement;

  private viewRows = 100;
  private fontSize = 16;
  private yOffset = 0;

  get GameGrid(): Grid {
    return this.gameGrid;
  }

  get Player(): Player {
    return this.player;
  }

  get Screen(): HTMLDivElement {
    return this.screen;
  }

  get TileSize(): number {
    return this.fontSize;
  }

  set TileSize(size: number) {
    this.fontSize = size;
  }

  get ViewRows(): number {
    return this.viewRows;
  }

  set ViewRows(height: number) {
    this.viewRows = Math.ceil(height / this.TileSize);

    log("view rows: " + this.viewRows);
  }

  get YOffset(): number {
    return this.yOffset;
  }

  constructor(gameGrid: Grid, player: Player, screen: HTMLDivElement) {
    this.gameGrid = gameGrid;
    this.player = player;
    this.screen = screen;
  }

  normalizeXY(x: number, y: number): { row: number; col: number } {
    // border offset (1px all sides)
    x -= 2;
    y -= 2;

    let row = Math.floor(y / this.TileSize); // height of row == height of text
    const col = Math.floor((x / this.TileSize) * 2); // text half as wide as tall

    row += this.YOffset;

    return { row, col };
  }

  getHoverText(x: number, y: number): string | null {
    const { row, col } = this.normalizeXY(x, y);

    if (row == this.Player.Y && col == this.Player.X)
      return "Power: " + this.Player.PlayerPower;

    if (row < 0) return null;

    const tt = this.gameGrid.getTooltipText(col, row);
    let text = "";
    if (tt) {
      text = `<label>${tt.type}</label><br/>`;
      text += "HP: " + tt.currHP + "/" + tt.maxHP;
    }

    return text;
  }

  render(): void {
    const maxRows = this.ViewRows;
    const maxSky = Math.ceil(maxRows / 3);

    log("maxSky: " + maxSky);

    let bottomRow = this.player.Y + Math.ceil(maxRows / 2);
    if (bottomRow > this.gameGrid.Height) bottomRow = this.gameGrid.Height;

    let sky = 0;
    let topRow = bottomRow - maxRows;
    if (topRow < 0) {
      sky = -topRow;
      topRow = 0;

      if (sky > maxSky) {
        sky = maxSky;
        bottomRow += sky;
      }
    }

    this.yOffset = sky > 0 ? -sky : topRow;

    let i, j;
    let output = "";
    log("generating sky");
    for (i = 0; i < sky; i++) {
      for (j = 0; j < this.gameGrid.Width; j++)
        output += this._getEmptyOrPlayer(j, i - sky);

      output += "</br>";
    }

    log("generating ground");
    for (i = topRow; i < bottomRow; i++) {
      for (j = 0; j < this.gameGrid.Width; j++) {
        const block = this.gameGrid.block(j, i);
        if (block == null) continue;

        const type = block.Type;

        if (block.IsCleared) output += this._getEmptyOrPlayer(j, i);
        else output += TextGrid.SPRITE_LIST[type];
      }
      output += "<br/>";
    }

    this.screen.innerHTML = output;
  }

  private _getOrientationGlyph(): string {
    const orient = this.player.orient;

    if (orient == Orientation.NORTH) return "^";
    if (orient == Orientation.SOUTH) return "v";
    if (orient == Orientation.EAST) return ">";
    if (orient == Orientation.WEST) return "<";

    return "";
  }

  private _getEmptyOrPlayer(x: number, y: number): string {
    if (y == this.player.Y && x == this.player.X)
      return this._getOrientationGlyph();

    return "&nbsp;";
  }
}
