<template>
  <div id="inventory">
    <ul class="tabs">
      <li id="tools" @click="selectTab('tools')">Tools</li>
      <li id="items" @click="selectTab('items')">Items</li>
      <li id="econ" @click="selectTab('econ')">Econ</li>
    </ul>
    <div id="money">$ {{ game.Money }}</div>
    <div class="content">
      <ToolsList v-if="tab === 'tools'" :game="game"></ToolsList>
      <ItemsList v-if="tab === 'items'" :game="game"></ItemsList>
      <EconList v-if="tab === 'econ'" :game="game"></EconList>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

import { Game } from "../scripts/Core/Game";
import EconList from "./EconList.vue";
import ItemsList from "./ItemsList.vue";
import ToolsList from "./ToolsList.vue";

@Component({
  components: {
    ToolsList,
    ItemsList,
    EconList
  }
})
export default class Inventory extends Vue {
  @Prop() game!: Game;

  private tab = "tools";

  selectTab(tab: string) {
    this.tab = tab;
  }
}
</script>

<style lang="sass"></style>
