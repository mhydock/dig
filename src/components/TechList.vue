<template>
  <div id="techList">
    <template v-for="(tech, key) of game.TechnologyTree.technologies">
      <TechBox
        :game="game"
        :tech="tech"
        :key="key"
        v-if="tech.isVisible"
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
