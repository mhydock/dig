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

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

import { Game } from "../scripts/Core/Game";
import ItemBox from "./ItemBox.vue";

@Component({
  components: { ItemBox }
})
export default class ItemsList extends Vue {
  @Prop() game!: Game;
}
</script>

<style lang="scss"></style>
