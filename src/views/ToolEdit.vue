<template>
  <div class="wrapper">
    <div class="editor">
      <div class="collision-mask">
        <ul class="tabs">
          <li id="draw" @click="activeTab = 'draw'">Draw</li>
          <li id="view" @click="activeTab = 'view'">View</li>
        </ul>
        <div class="grid" v-if="activeTab === 'draw'">
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
                  height: CellEdgeLen + 'px',
                  width: CellEdgeLen + 'px',
                }"
                @click="setIntensity(i, j)"
              ></div>
            </div>
          </div>
        </div>
        <div class="mask-view" v-if="activeTab === 'view'"></div>
        <div class="grid-options" v-if="activeTab === 'draw'">
          <div>
            <label>Intensity</label>
            <span
              class="shade"
              :class="{ selected: currIntensity == i, dark: i > SHADES / 2 }"
              :style="{ background: getShadeFromIndex(i) }"
              v-for="(_, i) of new Array(SHADES)"
              :key="'shade' + i"
              @click="currIntensity = i"
            ></span>
          </div>
        </div>
        <div class="grid-options">
          <div>
            <label>Offsets</label>
            <label>X</label><input v-model="currTool.offset.x" type="number" />
            <label>Y</label><input v-model="currTool.offset.y" type="number" />
          </div>
          <div v-if="activeTab === 'draw'">
            <label>Dimensions</label>
            <label>Width</label><input v-model="Width" type="number" />
            <label>Height</label><input v-model="Height" type="number" />
          </div>
          <div v-if="activeTab === 'draw'">
            <button @click="clearGrid">Clear</button>
          </div>
        </div>
      </div>

      <div class="fields">
        <div class="tool-field">
          <select v-model="currTool">
            <template v-for="(tool, i) of tools.Tools">
              <option :value="tool" :key="'tool' + i">{{ tool.name }}</option>
            </template>
          </select>
        </div>

        <div class="tool-field"><label>ID</label><input v-model="ID" /></div>
        <div class="tool-field">
          <label>Name</label><input v-model="currTool.name" />
        </div>
        <div class="tool-field">
          <label>Description</label><input v-model="currTool.desc" />
        </div>
        <div class="tool-field">
          <label>Start Amount</label><input v-model="currTool.amount" />
        </div>
        <div class="tool-field">
          <label>Base Cost</label><input v-model="currTool.baseCost" />
        </div>
        <div class="tool-field">
          <label>Power</label><input v-model="currTool.power" />
        </div>
        <div class="tool-field">
          <label>Technology</label
          ><select v-model="currTool.technology">
            <template v-for="(tech, i) of tech.technologies">
              <option :value="tech" :key="'tech' + i">{{ tech.name }}</option>
            </template>
          </select>
        </div>
        <div class="tool-field">
          <label>Orientation</label>
          <select v-model="currTool.orientation">
            <option value="any">Any</option>
            <option value="horz">Horizontal</option>
            <option value="vert">Vertical</option>
          </select>
        </div>
        <div class="tool-field">
          <label>Can Move And Dig?</label
          ><input type="checkbox" v-model="currTool.canMove" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { v4 as uuidv4 } from "uuid";
import Vue from "vue";
import { Component } from "vue-property-decorator";

import { TechnologyTree } from "../scripts/Core/TechnologyTree";
import { Tool } from "../scripts/Core/Tool";
import { ToolsInventory } from "../scripts/Core/ToolsInventory";

@Component
export default class ToolEdit extends Vue {
  SHADES = 16;

  tech: TechnologyTree = new TechnologyTree();
  tools: ToolsInventory = new ToolsInventory(this.tech);
  currTool: Tool = this.tools.Tools[0];
  currIntensity = 0;
  activeTab: "draw" | "view" = "draw";

  private gridDims = { width: 0, height: 0 };

  constructor() {
    super();
  }

  mounted() {
    const grid = this.$refs["grid"] as HTMLDivElement;
    if (grid) {
      this.gridDims.width = grid.offsetWidth;
      this.gridDims.height = grid.offsetHeight;
    }
  }

  get ID() {
    const m = this.tools.ToolsMap;
    return Object.keys(m).filter((k) => m[k] === this.currTool)[0] || "";
  }

  set ID(value: string) {
    delete this.tools.ToolsMap[this.ID];
    this.tools.ToolsMap[value] = this.currTool;
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

  get CellEdgeLen() {
    const w = this.gridDims.width / this.Width;
    const h = this.gridDims.height / this.Height;
    return Math.min(w, h);
  }

  getShadeFromIndex(intensity: number) {
    return this.getShade(intensity / this.SHADES);
  }

  getShade(intensity: number) {
    const i = Math.max(255 - 255 * intensity, 0);
    return `rgba(${i}, ${i}, ${i}, 1)`;
  }

  setIntensity(row: number, col: number) {
    this.$set(
      this.currTool.CollisionMask[row],
      col,
      this.currIntensity / this.SHADES
    );
  }

  clearGrid() {
    for (const row of this.currTool.CollisionMask)
      for (let col = 0; col < row.length; col++) this.$set(row, col, 0);
  }

  addNew() {
    const newTool = new Tool(
      "New Tool",
      "",
      0,
      0,
      0,
      this.tech.Technologies[0],
      0,
      0,
      false
    );

    const id = uuidv4().split("-")[0];
    this.tools.ToolsMap[id] = newTool;
    this.tools.Tools.push(newTool);
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: center;
  overflow: hidden;
  padding: 1rem;
}

.editor {
  border: 1px solid black;
  background: white;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-between;
  width: 40rem;
  max-height: 100%;
  overflow: auto;
}

.collision-mask {
  border: 1px solid black;
  flex: 1 1 auto;
  height: auto;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  overflow: hidden;

  .mask-view {
    flex: 1 1 auto;
  }

  .grid {
    height: auto;
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    justify-content: stretch;
    align-items: stretch;
    overflow: hidden;
    padding: 1rem;

    background-image: radial-gradient(white 1px, transparent 1px),
      radial-gradient(white 1px, #aaa 1px);
    background-size: calc(10 * 1px) calc(10 * 1px);
    background-position: 0 0, calc(5 * 1px) calc(5 * 1px);

    .grid-wrapper {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      flex: 1 1 auto;
    }

    .row {
      display: flex;
      flex-direction: row;
      justify-content: stretch;

      .cell {
        cursor: pointer;
        border: 1px solid black;
        border-top: none;
        border-left: none;
        width: 100%;
        position: relative;

        &:first-child {
          border-left: 1px solid black;
        }

        img {
          width: 100%;
        }

        span {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
      }

      &:first-child {
        .cell {
          border-top: 1px solid black;
        }
      }
    }
  }

  .grid-options {
    flex: 0 0 auto;
    display: flex;
    flex-direction: row;
    justify-content: stretch;
    align-items: stretch;
    font-size: 0.85rem;
    z-index: 1;

    div {
      border: 1px solid black;
      flex: 1 1 auto;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem;
      padding-left: 0;
      margin: -1px;
    }

    label {
      padding: 0rem 0.5rem;
      flex: 0 0 auto;
    }

    input {
      flex: 1 1 auto;
      border: 1px solid black;
      border-radius: 0;
      height: 1.5rem;
      font-size: 0.85rem;
      width: 1rem;
    }

    button {
      flex: 1 1 auto;
      margin-left: 0.5rem;
    }

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
  }
}

.fields {
  flex: 0 0 auto;
}

.tool-field {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: stretch;
  text-align: left;
  margin-bottom: 0.5rem;

  label {
    width: 10rem;
    flex: 0 0 auto;
  }

  input,
  select,
  input:focus,
  select:focus {
    height: 2rem;
    flex: 1 1 auto;
    border: 1px solid black;
    border-radius: 0;
    background: white;
    font-size: 1rem;
  }

  input:active,
  select:active {
    border-radius: 0;
  }
}
</style>
