<template>
  <div id="toolsList">
    <template v-for="(tool, key) of game.ToolsInventory.Tools">
      <ToolBox
        :game="game"
        :tool="tool"
        :key="key"
        v-if="item.IsResearched"
      ></ToolBox>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

import { Game } from "../scripts/Core/Game";
import ToolBox from "./ToolBox.vue";

@Component({
  components: { ToolBox }
})
export default class ToolsList extends Vue {
  @Prop() game!: Game;
}
</script>

<style lang="scss"></style>
