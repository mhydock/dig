<template>
  <div id="techList">
    <template v-for="(tech, key) of game.TechnologyTree.Technologies">
      <TechBox
        :game="game"
        :tech="tech"
        :key="key"
        v-if="tech.IsVisible"
      ></TechBox>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

import { Game } from "../scripts/Core/Game";
import TechBox from "./TechBox.vue";

@Component({
  components: { TechBox }
})
export default class ToolsList extends Vue {
  @Prop() game!: Game;
}
</script>

<style lang="scss"></style>
