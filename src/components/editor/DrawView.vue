<template>
  <div class="grid-view-wrapper">
    <div class="grid">
      <div class="grid-wrapper" ref="grid">
        <div
          class="row"
          v-for="(row, i) of currTool.CollisionMask"
          :key="'row' + i"
        >
          <div
            class="cell"
            v-for="(cell, j) of row"
            :key="'cell' + j"
            :style="{
              background: getShade(cell),
              height: CellEdgeLength + 'px',
              width: CellEdgeLength + 'px',
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
        <label>Width</label><input v-model.number="Width" type="number" />
        <label>Height</label><input v-model.number="Height" type="number" />
      </div>
      <div>
        <button @click="clearGrid">Clear</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";

import GridView from "./GridView.vue";

@Component
export default class DrawView extends GridView {
  constructor() {
    super();
  }

  get Height() {
    return this.currTool.CollisionMask.length;
  }

  set Height(value: number) {
    if (value < 1) return;

    while (this.currTool.CollisionMask.length > value)
      this.currTool.CollisionMask.pop();

    while (this.currTool.CollisionMask.length < value)
      this.currTool.CollisionMask.push(new Array(this.Width).fill(0));
  }

  get Width() {
    return this.currTool.CollisionMask[0].length;
  }

  set Width(value: number) {
    if (value < 1) return;

    for (const r of this.currTool.CollisionMask) {
      while (r.length > value) r.pop();
      while (r.length < value) r.push(0);
    }
  }

  get CellEdgeLength() {
    const w = this.gridDims.width / this.Width;
    const h = this.gridDims.height / this.Height;
    return Math.min(w, h);
  }

  clearGrid() {
    for (const row of this.currTool.CollisionMask)
      for (let col = 0; col < row.length; col++) this.$set(row, col, 0);
  }
}
</script>

<style lang="scss" scoped>
.shade {
  cursor: pointer;
  flex: 1 1 auto;
  width: 1.5rem;
  height: 1.5rem;
  border: 1px solid black;
  display: block;
  flex: 0 0 auto;

  &.selected {
    border-width: 3px;
    border-style: double;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    color: black;

    &::before {
      content: "\2022";
    }
  }

  &.selected.dark {
    color: white;
    border-color: white;
  }
}
</style>
