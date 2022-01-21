<template>
  <div class="list-item">
    <h3>{{ tech.Name }}</h3>
    <div class="list-item-body">
      <label class="quantity">Level: {{ tech.Level }}</label>
      <label>Next: $ {{ tech.ResearchCost }}</label>
      <span class="gap"></span>
      <button
        @click="clickResearchButton"
        :disabled="tech.ResearchCost > game.Money"
      >
        Research
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

import { Game } from "../scripts/Core/Game";
import { Technology } from "../scripts/Core/Technology";

@Component
export default class TechBox extends Vue {
  @Prop() game!: Game;
  @Prop() tech!: Technology;

  private clickResearchButton = () => {
    const cost = this.tech.tryResearch(this.game.Money);
    if (cost >= 0) this.game.subMoney(cost);
    else alert("You do not have enough money to research " + this.tech.Name);
  };
}
</script>

<style lang="scss"></style>
