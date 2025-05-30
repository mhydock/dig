<template>
  <div :title="tool.desc" class="list-item">
    <span class="list-item-head">
      <button
        :class="[
          'selectButton',
          game.ToolsInventory.activeTool === tool ? 'active' : '',
        ]"
        :disabled="game.ToolsInventory.activeTool === tool || tool.amount === 0"
        @click="game.selectTool(tool)"
      ></button>
      <h3>{{ tool.name }}</h3>
      <span class="gap"></span>
      <h3 v-if="game.ToolsInventory.activeTool === tool">Selected</h3>
    </span>
    <div class="list-item-body">
      <label class="quantity" :title="amountTooltip"
        >x {{ amountWithSuffix }}</label
      >
      <label>Next: $ {{ tool.buyCost }}</label>
      <span class="gap"></span>
      <button :disabled="tool.amount <= 0" @click="clickSellButton">
        Sell
      </button>
      <button :disabled="tool.buyCost > game.Money" @click="clickBuyButton">
        Buy
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { withSuffix } from "../scripts/Core/Common";
import { Game } from "../scripts/Core/Game";
import { Tool } from "../scripts/Core/Tool";

const props = defineProps<{
  game: Game;
  tool: Tool;
}>();

const { game, tool } = props;

const amountWithSuffix = computed(() => withSuffix(tool.amount));
const amountTooltip = computed(() =>
  tool.amount > 1000 ? tool.amount.toString() : "",
);

function clickBuyButton() {
  const cost = tool.tryBuy(game.Money);
  if (cost >= 0) game.subMoney(cost);
  else alert("You do not have enough money to buy a " + tool.name);
}

function clickSellButton() {
  const sale = tool.trySell();
  if (sale >= 0) game.addMoney(sale);
  else alert("You cannot sell that tool");
}
</script>

<style lang="scss" scoped>
.selectButton {
  min-width: unset;
  padding: unset;
  width: 1rem;
  height: 1rem;
  margin-left: 0;
  margin-right: 0.5rem;
  position: relative;

  &:disabled {
    cursor: default;
  }

  &.active:disabled::after {
    content: "\2713";
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    position: absolute;
    left: 0px;
    bottom: 5%;
    font-size: 2.5rem;
    color: black;
  }
}
</style>
