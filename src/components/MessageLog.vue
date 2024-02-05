<template>
  <div class="log">
    <div class="header">
      <a @click="toggleCollapse()">Message Log</a>
      <span class="icon" :class="{ open: !collapsed }"></span>
      <span class="gap"></span>
      <button @click="game.clearMessages()">Clear Log</button>
    </div>
    <div class="body" :class="{ collapsed }" ref="messages">
      <div v-for="(message, i) of game.Messages" :key="i">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, Ref, ref, watch } from "vue";

import { debug } from "../scripts/Core/Common";
import { Game } from "../scripts/Core/Game";

const props = defineProps<{
  game: Game;
}>();

const { game } = props;

const collapsed = ref(false);
const messages: Ref<HTMLDivElement | null> = ref(null);

function toggleCollapse() {
  collapsed.value = !collapsed.value;
  debug("is collapsed", collapsed);
}

watch(game.Messages, () => {
  nextTick(() =>
    messages?.value?.scrollTo({
      top: messages?.value?.scrollHeight,
      behavior: "smooth",
    })
  );
});
</script>
<style lang="scss">
.log {
  border-top: 1px solid black;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.header {
  border-bottom: 1px solid black;
  text-align: left;
  width: 100%;
  padding: 0.25rem 1rem;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  a {
    cursor: pointer;
  }
}

.body {
  overflow: auto;
  width: 100%;
  text-align: left;
  padding: 0rem 1rem;
  height: 20vh;
  max-height: 20vh;

  transition: max-height ease 0.2s;
  &.collapsed {
    max-height: 0;
    overflow: hidden;
  }
}

.icon {
  width: 1.1rem;
  height: 1.1rem;
  max-width: 1.1rem;
  max-height: 1.1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &::after {
    content: "\25b6";
  }

  &.open::after {
    transform: rotate(90deg);
    transform-origin: 50% 50%;

    transition: transform ease 0.2s;
  }
}
</style>
