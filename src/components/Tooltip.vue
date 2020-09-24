<template>
  <div
    id="tooltip"
    v-if="hoverText"
    :style="{ top: y + 2 + 'px', left: x + 2 + 'px' }"
  >
    <span v-if="hoverText.power">Power: {{ hoverText.power }}</span>
    <span v-if="hoverText.type">{{ hoverText.type }}</span>
    <span v-if="hoverText.currHP && hoverText.maxHP"
      >HP: {{ hoverText.currHP }} / {{ hoverText.maxHP }}</span
    >
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

import { HoverText } from "../scripts/UI/GameGrid";

@Component({
  components: {}
})
export default class ToolsList extends Vue {
  @Prop() x!: number;
  @Prop() y!: number;
  @Prop() hoverText!: HoverText;

  //   let offset =
  //       this.tooltip.getBoundingClientRect().height -
  //       (this.gameScreen.clientHeight - y);
  //     offset = offset >= 0 ? offset : 0;
}
</script>

<style lang="scss"></style>
