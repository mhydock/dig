<template>
  <div id="techList"></div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

import { Game } from "../scripts/Core/Game";
import { TechBox } from "../scripts/UI/TechBox";

@Component
export default class ToolsList extends Vue {
  @Prop() game: Game;

  mounted() {
    const techBoxList = document.getElementById("techList");
    const techs = this.game.TechnologyTree.Technologies;
    for (const h in techs) {
      const box = new TechBox(this.game, techs[h]);
      techBoxList.appendChild(box.TechBox);
    }
  }
}
</script>

<style lang="scss"></style>
