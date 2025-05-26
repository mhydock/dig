<template>
  <div id="techList">
    <template v-for="(tech, key) of game.TechnologyTree.technologies">
      <TechBox
        v-if="tech.isVisible"
        :key="key"
        :game="game"
        :tech="tech"
      ></TechBox>
    </template>
  </div>
</template>

<script setup lang="ts">
import { Game } from "../scripts/Core/Game";
import TechBox from "./TechBox.vue";

defineProps<{
  game: Game;
}>();
</script>

<style lang="scss"></style>
