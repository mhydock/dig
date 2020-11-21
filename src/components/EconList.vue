<template>
  <div id="econList" class="list-panel">
    <ul class="tabs">
      <li @click="selectTab('tech')">Technologies</li>
      <li @click="selectTab('busi')">Businesses</li>
    </ul>
    <div class="content">
      <TechList v-if="tab === 'tech'" :game="game"></TechList>
      <div id="busiList" v-if="tab === 'busi'"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

import { Game } from "../scripts/Core/Game";
import TechList from "./TechList.vue";

@Component({
  components: { TechList }
})
export default class EconList extends Vue {
  @Prop() game!: Game;

  private tab = "tech";

  selectTab(tab: string) {
    this.tab = tab;
  }
}
</script>

<style lang="scss">
#econList {
  border: none;
  width: 100%;
}
</style>
