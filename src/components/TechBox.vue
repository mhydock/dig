<template>
  <div class="list-item">
    <h3>{{ tech.name }}</h3>
    <div class="list-item-body">
      <label class="quantity">Level: {{ tech.level }}</label>
      <label>Next: $ {{ tech.researchCost }}</label>
      <span class="gap"></span>
      <button
        :disabled="tech.researchCost > game.Money"
        @click="clickResearchButton"
      >
        Research
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Game } from "../scripts/Core/Game";
import { Technology } from "../scripts/Core/Technology";

const props = defineProps<{
  game: Game;
  tech: Technology;
}>();

const { game, tech } = props;

function clickResearchButton() {
  const cost = tech.tryResearch(game.Money);
  if (cost >= 0) game.subMoney(cost);
  else alert("You do not have enough money to research " + tech.name);
}
</script>

<style lang="scss"></style>
