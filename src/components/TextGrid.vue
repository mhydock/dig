<template>
  <div id="gameScreen" @mousemove="updateToolTip" @mouseout="clearToolTip">
    <div id="tiles"></div>
    <template v-if="GameGrid.affected.length > 0">
      <template v-for="bp of GameGrid.affected">
        <div
          class="highlight"
          :key="`${bp.point.x},${bp.point.y}`"
          :style="{
            left: `${(bp.point.x * TileSize) / 2}px`,
            top: `${(bp.point.y - YOffset) * TileSize}px`,
            width: `${TileSize / 2}px`,
            height: `${TileSize}px`,
            opacity: bp.point.weight,
          }"
        ></div>
      </template>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

import {
  byId,
  debug,
  Orientation,
} from "../scripts/Core/Common";
import { Game } from "../scripts/Core/Game";
import { Grid } from "../scripts/Core/Grid";
import { Player } from "../scripts/Core/Player";
import { GameGrid, HoverText } from "../scripts/UI/GameGrid";

@Component({
  components: {},
})
export default class TextGrid extends Vue implements GameGrid {
  private static SPRITE_LIST = [
    "\u2593",
    "\u2592",
    "\u2591",
    "%",
    "#",
    "=",
    "?",
    "&amp;",
  ];

  @Prop() game!: Game;

  private viewRows = 100;
  private fontSize = 20;
  private yOffset = 0;

  get GameGrid(): Grid {
    return this.game.Grid;
  }

  get Player(): Player {
    return this.game.Player;
  }

  get Screen(): HTMLDivElement {
    return byId("tiles") as HTMLDivElement;
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

    debug("view rows: " + this.viewRows);
  }

  get YOffset(): number {
    return this.yOffset;
  }

  mounted() {
    const fontSize = getComputedStyle(this.Screen).fontSize;
    const tileSize = Number(fontSize.substr(0, fontSize.length - 2));
    this.TileSize = tileSize;

    window.onresize = this.onResizeFunc;
    this.onResizeFunc();
    this.drawScreen();
  }

  unmount() {
    window.onresize = null;
  }

  private onResizeFunc = () => {
    this.ViewRows = this.Screen.offsetHeight;
  };

  @Watch("Player.X")
  @Watch("Player.Y")
  @Watch("Player.Orientation")
  @Watch("GameGrid.affected")
  private playerMoved() {
    this.drawScreen();
  }

  normalizeXY(x: number, y: number): { row: number; col: number } {
    let row = Math.floor(y / this.TileSize); // height of row == height of text
    const col = Math.floor((x / this.TileSize) * 2); // text half as wide as tall

    row += this.YOffset;

    return { row, col };
  }

  getHoverText(x: number, y: number): HoverText | null {
    const { row, col } = this.normalizeXY(x, y);

    if (row == this.Player.Y && col == this.Player.X)
      return { power: this.Player.PlayerPower };

    if (row < 0) return null;

    return this.GameGrid.getTooltipText(col, row);
  }

  updateToolTip(event: MouseEvent) {
    const x = event.offsetX;
    const y = event.offsetY;

    this.$emit("updateToolTip", {
      hoverText: this.getHoverText(x, y),
      pos: {
        x,
        y,
      },
    });
  }

  clearToolTip() {
    this.$emit("updateToolTip", {
      hoverText: null,
      pos: {
        x: 0,
        y: 0,
      },
    });
  }

  drawScreen(): void {
    const maxRows = this.ViewRows;
    const maxSky = Math.ceil(maxRows / 3);

    debug("maxSky: " + maxSky);

    let bottomRow = this.Player.Y + Math.ceil(maxRows / 2);
    if (bottomRow > this.GameGrid.Height) bottomRow = this.GameGrid.Height;

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
    debug("generating sky");
    for (i = 0; i < sky; i++) {
      for (j = 0; j < this.GameGrid.Width; j++)
        output += this._getEmptyOrPlayer(j, i - sky);

      output += "</br>";
    }

    debug("generating ground");
    for (i = topRow; i < bottomRow; i++) {
      for (j = 0; j < this.GameGrid.Width; j++) {
        const block = this.GameGrid.blockAt(j, i);
        if (block == null) continue;

        const type = block.Type;

        if (block.IsCleared) output += this._getEmptyOrPlayer(j, i);
        else output += TextGrid.SPRITE_LIST[type];
      }
      output += "<br/>";
    }

    this.Screen.innerHTML = output;
  }

  private _getOrientationGlyph(): string {
    const orient = this.Player.orient;

    if (orient == Orientation.NORTH) return "^";
    if (orient == Orientation.SOUTH) return "v";
    if (orient == Orientation.EAST) return ">";
    if (orient == Orientation.WEST) return "<";

    return "";
  }

  private _getEmptyOrPlayer(x: number, y: number): string {
    if (y == this.Player.Y && x == this.Player.X)
      return this._getOrientationGlyph();

    return "&nbsp;";
  }
}
</script>
