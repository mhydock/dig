<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div id="inventory" class="list-panel">
    <ul class="tabs">
      <li
        id="tools"
        @click="selectTab('tools')"
        :class="{ selected: tab === 'tools' }"
      >
        Tools
      </li>
      <li
        id="items"
        @click="selectTab('items')"
        :class="{ selected: tab === 'items' }"
      >
        Items
      </li>
      <li
        id="econ"
        @click="selectTab('econ')"
        :class="{ selected: tab === 'econ' }"
      >
        Econ
      </li>
    </ul>
    <div id="money">$ {{ game.Money }}</div>
    <div class="content">
      <ToolsList v-if="tab === 'tools'" :game="game"></ToolsList>
      <ItemsList v-if="tab === 'items'" :game="game"></ItemsList>
      <EconList v-if="tab === 'econ'" :game="game"></EconList>
    </div>
    <MessageLog :game="game"></MessageLog>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import { Game } from "../scripts/Core/Game";
import EconList from "./EconList.vue";
import ItemsList from "./ItemsList.vue";
import MessageLog from "./MessageLog.vue";
import ToolsList from "./ToolsList.vue";

defineProps<{
  game: Game;
}>();

const tab = ref("tools");

function selectTab(newTab: string) {
  tab.value = newTab;
}
</script>

<style lang="scss">
#money {
  height: 3rem;
  line-height: 3rem;

  margin-right: 2rem;

  position: absolute;
  top: 0;
  right: 0;
}
</style>
