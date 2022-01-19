<template>
  <div class="wrapper">
    <div class="editor">
      <div class="collision-mask">
        <ul class="tabs">
          <li
            v-for="(tabName, key) of tabs"
            :class="{ selected: activeTab === tabName }"
            @click="setTab(tabName)"
            :key="key"
          >
            {{ tabName[0].toUpperCase() + tabName.substring(1) }}
          </li>
          <li class="fill">
            <button @click="addNew()">Create New</button>
            <a :href="JsonBlobUrl" :download="ID + '.json'" class="button">
              Export to JSON
            </a>
          </li>
        </ul>
        <keep-alive>
          <component :is="component[activeTab]" :currTool="currTool" />
        </keep-alive>
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
          <label>Technologies</label>
          <TechDepends :currTool="currTool" :techTree="techTree" />
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

import DrawView from "../components/editor/DrawView.vue";
import MaskView from "../components/editor/MaskView.vue";
import TechDepends from "../components/editor/TechDepends.vue";
import { TechnologyTree } from "../scripts/Core/TechnologyTree";
import { Tool } from "../scripts/Core/Tool";
import { ToolsInventory } from "../scripts/Core/ToolsInventory";

const TABS = ["draw", "view"] as const;
type EditorTabs = typeof TABS[number];

@Component({
  components: { DrawView, MaskView, TechDepends },
})
export default class ToolEdit extends Vue {
  techTree: TechnologyTree = new TechnologyTree();
  tools: ToolsInventory = new ToolsInventory(this.techTree);
  currTool: Tool = this.tools.Tools[0];

  tabs = TABS;
  activeTab: EditorTabs = "draw";
  component = {
    draw: DrawView,
    view: MaskView,
  };

  constructor() {
    super();
  }

  setTab(tab: "draw" | "view") {
    this.activeTab = tab;
  }

  get ID() {
    const m = this.tools.ToolsMap;
    return Object.keys(m).filter((k) => m[k] === this.currTool)[0] || "";
  }

  set ID(value: string) {
    delete this.tools.ToolsMap[this.ID];
    this.$set(this.tools.ToolsMap, value, this.currTool);
  }

  get JsonBlobUrl() {
    const depends = this.currTool.TechDependencies.map((td) => ({
      tech: this.techTree.keyFor(td.tech),
      level: td.level,
    }));

    const tempTool = { ...this.currTool } as Record<string, unknown>;
    tempTool["techDepends"] = depends;
    const textData = JSON.stringify(tempTool, null, 2);
    const blobData = new Blob([textData], { type: "application/json" });
    return window.URL.createObjectURL(blobData);
  }

  addNew() {
    const newTool = new Tool("New Tool", "", 0, 0, 0, [], 0, false);

    const id = uuidv4().split("-")[0];
    this.tools.ToolsMap[id] = newTool;
    this.tools.Tools.push(newTool);
    this.currTool = newTool;
  }
}
</script>

<style lang="scss">
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
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  overflow: hidden;

  .grid-view-wrapper {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
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

    position: relative;

    .grid-wrapper {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      flex: 1 1 auto;

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

    div:last-child {
      border-right: none;
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
      width: 2rem;
    }

    button {
      flex: 1 1 auto;
      margin-left: 0.5rem;
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
  select {
    height: 2rem;
    flex: 1 1 auto;
    font-size: 1rem;
  }
}

input[type="checkbox"] {
  appearance: none;
  max-width: 2rem;
  margin: 0;
  position: relative;

  &:hover {
    cursor: pointer;
  }

  &:checked::after {
    content: "\2713";
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 5px;
    left: 5px;
    right: 5px;
    bottom: 5px;
    font-size: 2rem;
  }
}

.tabs li.fill {
  border: none;
  flex: 1 1 auto;
  text-align: right;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: stretch;
  padding: 0;

  &:hover {
    background: transparent;
  }

  .button,
  button {
    margin: 0.25rem;
    margin-left: 0;
    padding: 0rem 0.75rem;
  }
}
</style>
