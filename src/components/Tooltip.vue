<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div
    v-if="hoverText"
    id="tooltip"
    :style="{ top: y + 4 + 'px', left: x + 4 + 'px' }"
  >
    <span v-if="hoverText.power">Power: {{ hoverText.power }}</span>
    <span v-if="hoverText.type">{{ hoverText.type }}</span>
    <span v-if="hoverText.currHP && hoverText.maxHP"
      >HP: {{ hoverText.currHP }} / {{ hoverText.maxHP }}</span
    >
  </div>
</template>

<script setup lang="ts">
import { HoverText } from "../scripts/UI/GameGrid";

defineProps<{
  x: number;
  y: number;
  hoverText: HoverText | null;
}>();

//   let offset =
//       this.tooltip.getBoundingClientRect().height -
//       (this.gameScreen.clientHeight - y);
//     offset = offset >= 0 ? offset : 0;
</script>

<style lang="scss">
#tooltip {
  white-space: nowrap;
}
</style>
