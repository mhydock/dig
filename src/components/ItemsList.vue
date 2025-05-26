<template>
  <div id="itemsList">
    <template v-for="(item, key) of game.ItemsInventory.Items">
      <ItemBox
        v-if="item.IsKnown"
        :key="key"
        :game="game"
        :item="item"
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
