<template>
  <div class="grid-view-wrapper">
    <div class="grid">
      <div class="grid-wrapper" ref="grid">
        <div
          class="row"
          v-for="(row, i) of currTool.collisionMask"
          :key="'row' + i"
        >
          <div
            class="cell"
            v-for="(cell, j) of row"
            :key="'cell' + j"
            :style="{
              background: getShade(cell),
              height: cellEdgeLength + 'px',
              width: cellEdgeLength + 'px',
            }"
            @click="setIntensity(i, j)"
          ></div>
        </div>
      </div>
    </div>
    <div class="grid-options">
      <div>
        <label>Intensity</label>
        <span
          class="shade"
          :class="{ selected: currIntensity == i, dark: i > SHADES / 2 }"
          :style="{ background: getShadeFromIndex(i) }"
          v-for="(_, i) of new Array(SHADES + 1)"
          :key="'shade' + i"
          @click="currIntensity = i"
        ></span>
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
      <div>
        <label>Dimensions</label>
        <label>Width</label><input v-model.number="width" type="number" />
        <label>Height</label><input v-model.number="height" type="number" />
      </div>
      <div>
        <button @click="clearGrid">Clear</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, Ref, ref } from "vue";

import { Tool } from "../../scripts/Core/Tool";
import { getShade, getShadeFromIndex, SHADES, useGridView } from "./GridView";

const props = defineProps<{
  currTool: Tool;
}>();

const { currTool } = props;
const grid: Ref<HTMLDivElement | null> = ref(null);

const { gridDims } = useGridView(grid);
const currIntensity = ref(0);

const height = computed({
  get() {
    return currTool.collisionMask.length;
  },
  set(value: number) {
    if (value < 1) return;

    while (currTool.collisionMask.length > value) {
      currTool.collisionMask.pop();
    }

    while (currTool.collisionMask.length < value) {
      currTool.collisionMask.push(new Array(width.value).fill(0));
    }
  },
});

const width = computed({
  get() {
    return currTool.collisionMask[0].length;
  },
  set(value: number) {
    if (value < 1) return;

    for (const r of currTool.collisionMask) {
      while (r.length > value) r.pop();
      while (r.length < value) r.push(0);
    }
  },
});

const cellEdgeLength = computed(() => {
  const w = gridDims.value.width / width.value;
  const h = gridDims.value.height / height.value;
  return Math.min(w, h);
});

function clearGrid() {
  for (const row of currTool.collisionMask)
    for (let col = 0; col < row.length; col++) {
      row[col] = 0;
    }
}

function setIntensity(row: number, col: number) {
  currTool.collisionMask[row][col] = currIntensity.value / SHADES;
}
</script>

<style lang="scss" scoped>
.shade {
  cursor: pointer;
  width: 1.5rem;
  height: 1.5rem;
  border: 1px solid black;
  display: block;
  flex: 0 0 auto;
  position: relative;

  &.selected::before {
    color: black;
    content: "\2022";
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 1px;
    left: 1px;
    right: 1px;
    bottom: 1px;
    border: 1px solid black;
  }

  &.selected.dark::before {
    color: white;
    border-color: white;
  }
}
</style>
