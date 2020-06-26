<template>
  <div id="toolsList"></div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

import { Game } from "../scripts/Core/Game";
import { ToolBox } from "../scripts/UI/ToolBox";

@Component
export default class ToolsList extends Vue {
  @Prop() game: Game;

  mounted() {
    const toolBoxList = document.getElementById("toolsList");
    const tools = this.game.ToolsInventory.Tools;
    for (const t in tools) {
      const box = new ToolBox(this.game, tools[t]);
      toolBoxList.appendChild(box.ToolBox);
    }
  }
}
</script>

<style lang="scss"></style>
