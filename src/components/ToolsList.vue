<template>
  <div id="toolsList">
    <template v-for="(tool, key) of game.ToolsInventory.tools">
      <ToolBox
        v-if="tool.isResearched"
        :key="key"
        :game="game"
        :tool="tool"
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
