<template>
  <div id="game">
    <div id="progress">
      <div id="progCursor" :style="{ top: game.Progress + '%' }">&gt;</div>
    </div>
    <div id="gridWrapper">
      <TextGrid :game="game" @updateToolTip="updateToolTip"></TextGrid>
      <Tooltip :hoverText="hoverText" :x="toolTipX" :y="toolTipY"></Tooltip>
    </div>
    <Inventory :game="game"></Inventory>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import Inventory from "../components/Inventory.vue";
import TextGrid from "../components/TextGrid.vue";
import Tooltip from "../components/Tooltip.vue";
import { debug } from "../scripts/Core/Common";
import { Game } from "../scripts/Core/Game";
import { HoverText } from "../scripts/UI/GameGrid";

@Component({
  components: { Inventory, TextGrid, Tooltip },
})
export default class GameView extends Vue {
  private game: Game;
  private toolTipX!: number;
  private toolTipY!: number;
  private hoverText: HoverText | null;

  constructor() {
    super();

    this.game = new Game();
    this.hoverText = null;
    this.toolTipX = 0;
    this.toolTipY = 0;
  }

  mounted() {
    document.onkeydown = this.onKeyDownFunc;
    debug("Game has begun");
  }

  private updateToolTip(event: {
    hoverText: HoverText | null;
    pos: { x: number; y: number };
  }) {
    this.hoverText = event.hoverText;
    this.toolTipX = event.pos.x;
    this.toolTipY = event.pos.y;
  }

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
  };
}
</script>

<style lang="scss">
@import "../assets/main.css";

#game {
  height: 100%;

  margin: 0;
  padding: 1rem;

  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: center;
  overflow: hidden;
}

#gridWrapper {
  position: relative;
}
</style>
