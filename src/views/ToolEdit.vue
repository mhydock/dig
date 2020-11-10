<template>
  <div class="wrapper">
    <div class="editor">
      <div class="collision-mask">
        <div class="grid"></div>
        <div class="offsets">
          <label>Offsets</label>
          <label>X</label
          ><input v-model="currTool.areaOfEffect.x" type="number" />
          <label>Y</label
          ><input v-model="currTool.areaOfEffect.y" type="number" />
        </div>
      </div>

      <div class="tool-field">
        <select v-model="currTool">
          <template v-for="tool of tools.Tools">
            <option :value="tool" :key="tool">{{ tool.name }}</option>
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
          <template v-for="tech of tech.technologies">
            <option :value="tech" :key="tech">{{ tech.name }}</option>
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
  private tech: TechnologyTree = new TechnologyTree();
  private tools: ToolsInventory = new ToolsInventory(this.tech);
  private currTool: Tool = this.tools.Tools[0];

  constructor() {
    super();
  }

  get ID() {
    const m = this.tools.ToolsMap;
    return Object.keys(m).filter(k => m[k] === this.currTool)[0] || "";
  }

  set ID(value: string) {
    delete this.tools.ToolsMap[this.ID];
    this.tools.ToolsMap[value] = this.currTool;
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
  width: 40rem;
}

.collision-mask {
  border: 1px solid black;
  flex: 1 1 auto;
  height: 10rem;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  align-items: stretch;

  .grid {
    flex: 1 1 auto;
  }

  .offsets {
    flex: 0 0 auto;
    display: flex;
    flex-direction: row;
    justify-content: stretch;
    align-items: center;
    font-size: 0.85rem;
    padding: 0.5rem;
    padding-left: 0;

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
    }
  }
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
