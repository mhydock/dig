<template>
  <div :title="tool.Description">
    <h3>{{ tool.Name }}</h3>
    <label :title="AmountTooltip">x {{ AmountWithSuffix }}</label>
    <label>Next: $ {{ tool.BuyCost }}</label>
    <button @click="clickBuyButton" :disabled="tool.BuyCost > game.Money">
      Buy
    </button>
    <button @click="clickSellButton" :disabled="tool.Amount <= 0">Sell</button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

import { withSuffix } from "../scripts/Core/Common";
import { Game } from "../scripts/Core/Game";
import { Tool } from "../scripts/Core/Tool";

@Component
export default class ToolBox extends Vue {
  @Prop() game!: Game;
  @Prop() tool!: Tool;

  get AmountWithSuffix() {
    return withSuffix(this.tool.Amount);
  }

  get AmountTooltip() {
    return this.tool.Amount > 1000 ? this.tool.Amount : "";
  }

  private clickBuyButton = () => {
    const cost = this.tool.tryBuy(this.game.Money);
    if (cost >= 0) this.game.subMoney(cost);
    else alert("You do not have enough money to buy a " + this.tool.Name);
  };

  private clickSellButton = () => {
    const sale = this.tool.trySell();
    if (sale >= 0) this.game.addMoney(sale);
    else alert("You cannot sell that tool");
  };
}
</script>

<style lang="scss"></style>
