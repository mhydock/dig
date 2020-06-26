<template>
  <div id="itemsList"></div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

import { Game } from "../scripts/Core/Game";
import { ItemBox } from "../scripts/UI/ItemBox";

@Component
export default class ItemsList extends Vue {
  @Prop() game: Game;

  mounted() {
    const itemBoxList = document.getElementById("itemsList");
    const items = this.game.ItemsInventory.Items;
    for (const i in items) {
      const box = new ItemBox(this.game, items[i]);
      itemBoxList.appendChild(box.ItemBox);
    }
  }
}
</script>

<style lang="scss"></style>
