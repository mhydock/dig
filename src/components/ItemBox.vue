<template>
  <div :title="item.Description" class="list-item">
    <h4>{{ item.Name }}</h4>
    <div class="list-item-body">
      <label class="quantity" :title="amountTooltip"
        >x {{ amountWithSuffix }}</label
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

<script setup lang="ts">
import { computed } from "vue";

import { withSuffix } from "../scripts/Core/Common";
import { Game } from "../scripts/Core/Game";
import { Item } from "../scripts/Core/Item";

const props = defineProps<{
  game: Game;
  item: Item;
}>();

const { game, item } = props;

const amountWithSuffix = computed(() => withSuffix(item.Amount));
const amountTooltip = computed(() =>
  item.Amount > 1000 ? item.Amount.toString() : ""
);

function clickSellButton() {
  const sale = item.trySell();
  if (sale >= 0) game.addMoney(sale);
  else alert("You cannot sell that item");
}

function clickSell100Button() {
  const sale = item.trySellMany(100);
  if (sale >= 0) game.addMoney(sale);
  else alert("You cannot sell 100 of that item");
}

function clickSellAllButton() {
  const sale = item.trySellAll();
  if (sale >= 0) game.addMoney(sale);
  else alert("You cannot sell those items");
}
</script>

<style lang="scss"></style>
