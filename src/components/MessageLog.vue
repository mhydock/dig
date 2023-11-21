<template>
  <div class="log">
    <div class="header">
      <a @click="toggleCollapse()">Message Log</a>
      <span class="icon" :class="{open: !collapsed}"></span>
      <span class="gap"></span>
      <button @click="game.clearMessages()">Clear Log</button>
    </div>
    <div class="body" :class="{collapsed}" ref="messages">
      <div v-for="(message, i) of game.Messages" :key="i">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

import { Game } from "../scripts/Core/Game";
import { debug } from "@/scripts/Core/Common";

@Component({})
export default class MessageLog extends Vue {
  @Prop() game!: Game;
  collapsed = false;

  $refs!: {
    messages: HTMLDivElement;
  };

  toggleCollapse() {
    this.collapsed = !this.collapsed;
    debug("is collapsed", this.collapsed);
  }

  @Watch("game.Messages")
  private scrollToBottom() {
    this.$nextTick(() =>
      this.$refs.messages.scrollTo({
        top: this.$refs.messages.scrollHeight,
        behavior: "smooth",
      })
    );
  }
}
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

  transition: max-height ease .2s;
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

    transition: transform ease .2s;
  }
}
</style>
