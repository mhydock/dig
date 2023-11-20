<template>
  <div :title="item.Description" class="list-item">
    <h4>{{ item.Name }}</h4>
    <div class="list-item-body">
      <label class="quantity" :title="AmountTooltip"
        >x {{ AmountWithSuffix }}</label
      >
      <label>$ {{ item.Value }} per</label>
      <span class="gap"></span>
      <button @click="clickSellAllButton" v-if="item.Amount >= 2">
        Sell All
      </button>
      <button @click="clickSell100Button" v-if="item.Amount >= 100">
        Sell x100
      </button>
      <button @click="clickSellButton" :disabled="item.Amount <= 0">
        Sell
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

import { withSuffix } from "../scripts/Core/Common";
import { Game } from "../scripts/Core/Game";
import { Item } from "../scripts/Core/Item";

@Component
export default class ItemBox extends Vue {
  @Prop() game!: Game;
  @Prop() item!: Item;

  constructor() {
    super();
  }

  get AmountWithSuffix() {
    return withSuffix(this.item.Amount);
  }

  get AmountTooltip() {
    return this.item.Amount > 1000 ? this.item.Amount : "";
  }

  private clickSellButton() {
    const sale = this.item.trySell();
    if (sale >= 0) this.game.addMoney(sale);
    else alert("You cannot sell that item");
  }

  private clickSell100Button() {
    const sale = this.item.trySellMany(100);
    if (sale >= 0) this.game.addMoney(sale);
    else alert("You cannot sell 100 of that item");
  }

  private clickSellAllButton() {
    const sale = this.item.trySellAll();
    if (sale >= 0) this.game.addMoney(sale);
    else alert("You cannot sell those items");
  }
}
</script>

<style lang="scss"></style>
