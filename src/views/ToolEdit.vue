<template>
  <div class="wrapper">
    <div class="editor">
      <div class="collision-mask">
        <ul class="tabs">
          <li
            v-for="(tabName, key) of TABS"
            :class="{ selected: activeTab === tabName }"
            @click="setTab(tabName)"
            :key="key"
          >
            {{ tabName[0].toUpperCase() + tabName.substring(1) }}
          </li>
          <li class="fill">
            <button @click="addNew()">Create New</button>
            <a :href="jsonBlobUrl" :download="ID + '.json'" class="button">
              Export to JSON
            </a>
          </li>
        </ul>
        <keep-alive>
          <component
            :is="component[activeTab]"
            :currTool="currTool"
            :key="currToolId + activeTab"
          />
        </keep-alive>
      </div>

      <div class="fields">
        <div class="tool-field">
          <select v-model="currToolId">
            <template v-for="(tool, i) of tools.tools" :key="'tool' + i">
              <option :value="tool.id">
                {{ tool.name }}
              </option>
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
          <label>Start Amount</label>
          <NumberInput v-model="currTool.amount" placeholder="1" :default="1" />
        </div>
        <template v-if="activeTab === 'chart'">
          <div class="tool-field">
            <label>Base Cost</label>
            <NumberInput
              v-model="currTool.baseCost"
              placeholder="1"
              :default="1"
            />
          </div>
          <div class="tool-field">
            <label>Cost Func Type</label>
            <select v-model="currTool.costFunctionType">
              <template v-for="[key, value] of Object.entries(FuncType)">
                <option :value="value" v-if="typeof value !== 'string'">
                  {{ key[0] + key.substring(1).toLowerCase() }}
                </option>
              </template>
            </select>
          </div>
          <div class="tool-field">
            <label>&#x2BA1; Coefficients</label>
            <MultiInput
              :coefficients="currTool.costCoefficients"
              :function-type="currTool.costFunctionType"
            />
          </div>
          <div class="tool-field">
            <label>Base Power</label>
            <NumberInput
              v-model="currTool.basePower"
              placeholder="1"
              :default="1"
            />
          </div>
          <div class="tool-field">
            <label>Power Func Type</label>
            <select v-model="currTool.powerFunctionType">
              <template v-for="[key, value] of Object.entries(FuncType)">
                <option :value="value" v-if="typeof value !== 'string'">
                  {{ key[0] + key.substring(1).toLowerCase() }}
                </option>
              </template>
            </select>
          </div>
          <div class="tool-field">
            <label>&#x2BA1; Coefficients</label>
            <MultiInput
              :coefficients="currTool.powerCoefficients"
              :function-type="currTool.powerFunctionType"
            />
          </div>
        </template>
        <template v-else>
          <div class="tool-field">
            <label>Technologies</label>
            <TechDepends
              :currTool="currTool"
              :techTree="techTree"
              :key="currToolId"
            />
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
            <label>Can Move And Dig?</label>
            <input type="checkbox" v-model="currTool.canMove" />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { v4 as uuidv4 } from "uuid";
import { computed, reactive, Ref, ref, watch } from "vue";

import DrawView from "../components/editor/DrawView.vue";
import MaskView from "../components/editor/MaskView.vue";
import ChartView from "../components/editor/ChartView.vue";
import TechDepends from "../components/editor/TechDepends.vue";
import { TechnologyTree } from "../scripts/Core/TechnologyTree";
import { Tool } from "../scripts/Core/Tool";
import { ToolsInventory } from "../scripts/Core/ToolsInventory";
import { createGrowthFunction, FuncType } from "@/scripts/Core/Common";
import MultiInput from "@/components/editor/MultiInput.vue";
import NumberInput from "@/components/editor/NumberInput.vue";

const TABS = ["draw", "view", "chart"] as const;
type EditorTabs = (typeof TABS)[number];

const techTree = reactive(new TechnologyTree());
const tools = reactive(new ToolsInventory(techTree));
const currToolId = ref(tools.tools[0].id);
const activeTab: Ref<EditorTabs> = ref("draw");

const component = {
  draw: DrawView,
  view: MaskView,
  chart: ChartView,
};

function setTab(tab: "draw" | "view" | "chart") {
  activeTab.value = tab;
}

const ID = computed({
  get() {
    const m = tools.toolsMap;
    return Object.keys(m).filter((k) => k == currToolId.value)[0] || "";
  },
  set(value: string) {
    delete tools.toolsMap[ID.value];
    tools.toolsMap[value] = currTool.value;
  },
});

const currTool = computed(() => tools.toolsMap[currToolId.value]);

const jsonBlobUrl = computed(() => {
  const depends = currTool.value.techDepends.map((td) => ({
    tech: techTree.keyFor(td.tech),
    level: td.level,
  }));

  const tempTool = { ...currTool.value } as Record<string, unknown>;
  tempTool["techDepends"] = depends;
  delete tempTool["orientedColMasks"];
  const textData = JSON.stringify(tempTool, null, 2);
  const blobData = new Blob([textData], { type: "application/json" });
  return window.URL.createObjectURL(blobData);
});

function addNew() {
  const id = uuidv4().split("-")[0];
  const newTool = new Tool(id, "New Tool", "", 0, 0, 0, [], false);

  tools.toolsMap[id] = newTool;
  tools.tools.push(newTool);
  currToolId.value = id;
}

watch(
  [
    () => currTool.value.costFunctionType,
    () => currTool.value.costCoefficients,
  ],
  ([funcType, coefficients]) => {
    currTool.value.costFunc = createGrowthFunction(funcType, coefficients);
  },
  { deep: true },
);

watch(
  [
    () => currTool.value.powerFunctionType,
    () => currTool.value.powerCoefficients,
  ],
  ([funcType, coefficients]) => {
    console.log(coefficients);
    currTool.value.powerFunc = createGrowthFunction(funcType, coefficients);
  },
  { deep: true },
);
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

    background-image:
      radial-gradient(white 1px, transparent 1px),
      radial-gradient(white 1px, #aaa 1px);
    background-size: calc(10 * 1px) calc(10 * 1px);
    background-position:
      0 0,
      calc(5 * 1px) calc(5 * 1px);

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

  & > label {
    width: 10rem;
    flex: 0 0 auto;
  }

  input,
  select {
    height: 2rem;
    flex: 1 1 auto;
    font-size: 1rem;
    padding-left: 0.25rem;
  }

  select {
    appearance: none;
    position: relative;
    background-color: transparent;
    background-image: url("@/assets/icons/angle-down.svg");
    background-repeat: no-repeat;
    background-size: 1.25em .75em;
    background-position: right center;
    background-clip: border-box;
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
    max-height: 2rem;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    position: absolute;
    left: 0px;
    bottom: 0px;
    font-size: 3.33rem;
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
