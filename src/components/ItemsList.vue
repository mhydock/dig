<template>
  <div id="itemsList">
    <template v-for="(item, key) of game.ItemsInventory.Items">
      <ItemBox
        :game="game"
        :item="item"
        :key="key"
        v-if="item.IsKnown"
      ></ItemBox>
    </template>
  </div>
</template>

<script setup lang="ts">
import { Game } from "../scripts/Core/Game";
import ItemBox from "./ItemBox.vue";

defineProps<{
  game: Game;
}>();
</script>

<style lang="scss"></style>
