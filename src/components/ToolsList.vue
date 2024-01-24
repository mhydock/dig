<template>
  <div id="toolsList">
    <template v-for="(tool, key) of game.ToolsInventory.tools">
      <ToolBox
        :game="game"
        :tool="tool"
        :key="key"
        v-if="tool.isResearched"
      ></ToolBox>
    </template>
  </div>
</template>

<script setup lang="ts">
import { Game } from "../scripts/Core/Game";
import ToolBox from "./ToolBox.vue";

defineProps<{
  game: Game;
}>();
</script>

<style lang="scss"></style>
