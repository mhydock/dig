<template>
  <div id="econList" class="list-panel">
    <ul class="tabs">
      <li :class="{ selected: tab === 'tech' }" @click="selectTab('tech')">
        Technologies
      </li>
      <li :class="{ selected: tab === 'busi' }" @click="selectTab('busi')">
        Businesses
      </li>
    </ul>
    <div class="content">
      <TechList v-if="tab === 'tech'" :game="game"></TechList>
      <div v-if="tab === 'busi'" id="busiList"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import { Game } from "../scripts/Core/Game";
import TechList from "./TechList.vue";

defineProps<{
  game: Game;
}>();

const tab = ref("tech");

function selectTab(newTab: string) {
  tab.value = newTab;
}
</script>

<style lang="scss">
#econList {
  border: none;
  width: 100%;
}
</style>
