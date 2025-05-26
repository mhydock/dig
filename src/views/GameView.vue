<template>
  <div id="game">
    <div id="progress">
      <div id="progCursor" :style="{ top: game.Progress + '%' }">&gt;</div>
    </div>
    <div id="gridWrapper">
      <TextGrid :game="game" @update-tool-tip="updateToolTip"></TextGrid>
      <Tooltip :hover-text="hoverText" :x="toolTipX" :y="toolTipY"></Tooltip>
    </div>
    <Inventory :game="game"></Inventory>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, Ref, ref, watch } from "vue";

import Inventory from "../components/Inventory.vue";
import TextGrid from "../components/TextGrid.vue";
import Tooltip from "../components/Tooltip.vue";
import { debug } from "../scripts/Core/Common";
import { Game } from "../scripts/Core/Game";
import { HoverText, TooltipEvent } from "../scripts/UI/GameGrid";

const game = reactive(new Game()) as Game;
const toolTipX = ref(0);
const toolTipY = ref(0);
const hoverText: Ref<HoverText | null> = ref(null);

game.wireListeners();

const updateToolTip = (event: TooltipEvent) => {
  hoverText.value = event.hoverText;
  toolTipX.value = event.pos.x;
  toolTipY.value = event.pos.y;
};

watch(
  () => game.ToolsInventory.activeTool,
  (tool) => {
    if (tool?.amount === 0) {
      game.selectTool(null);
    }
  },
  {
    deep: true,
  },
);

// keycodes found here http://www.javascriptkeycode.com/
const onKeyDownFunc = (event: KeyboardEvent) => {
  switch (event.key) {
    case "ArrowUp":
      game.moveUp();
      break;
    case "ArrowDown":
      game.moveDown();
      break;
    case "ArrowLeft":
      game.moveLeft();
      break;
    case "ArrowRight":
      game.moveRight();
      break;
    case " ":
      game.tryDig();
      break;
  }
};

onMounted(() => {
  document.onkeydown = onKeyDownFunc;
  debug("Game has begun");
});
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
  display: flex;
  flex-direction: column;
}
</style>
