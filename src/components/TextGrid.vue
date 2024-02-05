<template>
  <div id="gameScreen" @mousemove="updateToolTip" @mouseout="clearToolTip">
    <div id="tiles" ref="tiles"></div>
    <template v-if="Grid.affected.length > 0">
      <template v-for="bp of Grid.affected">
        <div
          class="highlight"
          :key="`${bp.point.x},${bp.point.y}`"
          :style="{
            left: `${(bp.point.x * tileSize) / 2}px`,
            top: `${(bp.point.y - yOffset) * tileSize}px`,
            width: `${tileSize / 2}px`,
            height: `${tileSize}px`,
            opacity: bp.point.weight,
          }"
        ></div>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, Ref, ref, watch } from "vue";

import { debug, Orientation } from "../scripts/Core/Common";
import { Game } from "../scripts/Core/Game";
import { HoverText, TooltipEvent } from "../scripts/UI/GameGrid";

const SPRITE_LIST = ["\u2593", "\u2592", "\u2591", "%", "#", "=", "?", "&amp;"];

const props = defineProps<{
  game: Game;
}>();

const emit = defineEmits<{
  (e: "updateToolTip", tooltipEvent: TooltipEvent): void;
}>();

const viewRows = ref(100);
const tileSize = ref(20);
const yOffset = ref(0);
const tiles: Ref<HTMLDivElement | null> = ref(null);

const {
  game: { Grid, Player },
} = props;

function setViewRows(height: number) {
  viewRows.value = Math.ceil(height / tileSize.value);
}

const onResizeFunc = () => {
  debug(tiles.value);
  if (tiles.value) {
    debug(tiles.value.offsetHeight);
    setViewRows(tiles.value.offsetHeight);
  }
};

onMounted(() => {
  const fSize = tiles.value ? getComputedStyle(tiles.value).fontSize : "20px";
  const tSize = Number(fSize.slice(0, fSize.length - 2));
  tileSize.value = tSize;
  debug(fSize, tSize, tileSize.value);
  window.onresize = onResizeFunc;
  nextTick(() => {
    onResizeFunc();
    drawScreen();
  });
});

onUnmounted(() => {
  window.onresize = null;
});

watch(
  [
    () => Player.X,
    () => Player.Y,
    () => Player.Orientation,
    () => Grid.affected,
  ],
  () => {
    drawScreen();
  }
);

function normalizeXY(x: number, y: number): { row: number; col: number } {
  let row = Math.floor(y / tileSize.value); // height of row == height of text
  const col = Math.floor((x / tileSize.value) * 2); // text half as wide as tall

  row += yOffset.value;

  return { row, col };
}

function getHoverText(x: number, y: number): HoverText | null {
  const { row, col } = normalizeXY(x, y);

  if (row == Player.Y && col == Player.X) {
    return { power: Player.PlayerPower };
  }

  if (row < 0) return null;

  return Grid.getTooltipText(col, row);
}

function updateToolTip(event: MouseEvent) {
  const x = event.offsetX;
  const y = event.offsetY;

  emit("updateToolTip", {
    hoverText: getHoverText(x, y),
    pos: {
      x,
      y,
    },
  });
}

function clearToolTip() {
  emit("updateToolTip", {
    hoverText: null,
    pos: {
      x: 0,
      y: 0,
    },
  });
}

function drawScreen(): void {
  const maxRows = viewRows.value;
  const maxSky = Math.ceil(maxRows / 3);

  debug("maxSky: " + maxSky);

  let bottomRow = Player.Y + Math.ceil(maxRows / 2);
  if (bottomRow > Grid.Height) bottomRow = Grid.Height;

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

  yOffset.value = sky > 0 ? -sky : topRow;

  let i, j;
  let output = "";
  debug("generating sky");
  for (i = 0; i < sky; i++) {
    for (j = 0; j < Grid.Width; j++) {
      output += _getEmptyOrPlayer(j, i - sky);
    }

    output += "</br>";
  }

  debug("generating ground");
  for (i = topRow; i < bottomRow; i++) {
    for (j = 0; j < Grid.Width; j++) {
      const block = Grid.blockAt(j, i);
      if (block == null) continue;

      const type = block.Type;

      if (block.IsCleared) output += _getEmptyOrPlayer(j, i);
      else output += SPRITE_LIST[type];
    }
    output += "<br/>";
  }

  if (tiles.value) tiles.value.innerHTML = output;
}

function _getOrientationGlyph(): string {
  const orient = Player.orient;

  if (orient == Orientation.NORTH) return "^";
  if (orient == Orientation.SOUTH) return "v";
  if (orient == Orientation.EAST) return ">";
  if (orient == Orientation.WEST) return "<";

  return "";
}

function _getEmptyOrPlayer(x: number, y: number): string {
  if (y == Player.Y && x == Player.X) {
    return _getOrientationGlyph();
  }

  return "&nbsp;";
}
</script>

<style lang="scss" scoped>
#tiles {
  height: 100%;
}
</style>
