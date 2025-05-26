<template>
  <div class="grid-view-wrapper">
    <div class="grid">
      <div ref="grid" class="grid-wrapper">
        <div v-for="(row, i) of fullCollisionMask" :key="'row' + i" class="row">
          <div
            v-for="(cell, j) of row"
            :key="'cell' + j"
            class="cell"
            :style="{
              background: getShade(cell),
              height: maskCellEdgeLength + 'px',
              width: maskCellEdgeLength + 'px',
            }"
          ></div>
        </div>
      </div>
      <div class="overlay">
        <div
          class="player-icon"
          :style="{
            height: maskCellEdgeLength - 10 + 'px',
            width: maskCellEdgeLength - 10 + 'px',
          }"
        ></div>
      </div>
    </div>
    <div class="grid-options">
      <div>
        <label>Offsets</label>
        <label>X</label>
        <input v-model.number="currTool.offset.x" type="number" />
        <label>Y</label>
        <input v-model.number="currTool.offset.y" type="number" />
      </div>
      <div class="orient-toggle">
        <label>Up</label>
        <input v-model="showUp" type="checkbox" />
      </div>
      <div class="orient-toggle">
        <label>Down</label>
        <input v-model="showDown" type="checkbox" />
      </div>
      <div class="orient-toggle">
        <label>Left</label>
        <input v-model="showLeft" type="checkbox" />
      </div>
      <div class="orient-toggle">
        <label>Right</label>
        <input v-model="showRight" type="checkbox" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, Ref, ref } from "vue";

import { Tool } from "../../scripts/Core/Tool";
import { getShade, useGridView } from "./GridView";

const props = defineProps<{
  currTool: Tool;
}>();

const { currTool } = props;
const grid: Ref<HTMLDivElement | null> = ref(null);

const { gridDims } = useGridView(grid);

const showUp = ref(true);
const showDown = ref(true);
const showLeft = ref(true);
const showRight = ref(true);

const fullCollisionMask = computed(() => {
  const mask = currTool.collisionMask;
  const offset = currTool.offset;
  const rowWidth =
    offset.x > -mask[0].length / 2
      ? (mask[0].length + offset.x) * 2 - 1
      : Math.abs(offset.x) * 2 + 1;
  const colHeight =
    offset.y > -mask.length / 2
      ? (mask.length + offset.y) * 2 - 1
      : Math.abs(offset.y) * 2 + 1;

  const fullMask = [];
  const sideDim = Math.max(rowWidth, colHeight);
  for (let i = 0; i < sideDim; i++) fullMask.push(new Array(sideDim));

  const c = Math.floor(fullMask.length / 2);
  const h = Math.floor(mask.length / 2);
  for (let i = 0; i < mask.length; i++)
    for (let j = 0; j < Math.ceil(mask[i].length); j++) {
      const l = c - offset.x - j;
      const r = c + offset.x + j;
      const t = c - h - offset.y + i;
      const b = c + h + offset.y - i;
      const m = mask[i][j];
      if (showLeft.value) {
        fullMask[t][l] = Math.max(fullMask[t][l] || 0, m || 0);
      }
      if (showRight.value) {
        fullMask[t][r] = Math.max(fullMask[t][r] || 0, m || 0);
      }
      if (showUp.value) {
        fullMask[l][t] = Math.max(fullMask[l][t] || 0, m || 0);
      }
      if (showDown.value) {
        fullMask[r][b] = Math.max(fullMask[r][b] || 0, m || 0);
      }
    }

  return fullMask;
});

const maskCellEdgeLength = computed(() => {
  const side = fullCollisionMask.value.length;
  const w = gridDims.value.width / side;
  const h = gridDims.value.height / side;
  return Math.min(w, h);
});
</script>

<style lang="scss" scoped>
.overlay {
  position: absolute;
  top: -1px;
  left: -1px;
  right: 0;
  bottom: 0;
  z-index: 5;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .player-icon {
    border: 2px solid black;
    border-radius: 100rem;
    box-shadow:
      1px 0px white,
      -1px 0px white,
      0px 1px white,
      0px -1px white;
  }
}

input[type="checkbox"] {
  max-width: 1.5rem;

  &:checked::after {
    font-size: 2.5rem;
  }
}

.orient-toggle label {
  width: 3.5rem;
  text-align: left;
}
</style>
