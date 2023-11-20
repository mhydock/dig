<template>
  <div class="log">
    <div class="header">
      <span>Message Log</span>
      <button @click="game.clearMessages()">Clear Log</button>
    </div>
    <div class="body" ref="messages">
      <div v-for="(message, i) of game.Messages" :key="i">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

import { Game } from "../scripts/Core/Game";

@Component({})
export default class MessageLog extends Vue {
  @Prop() game!: Game;

  $refs!: {
    messages: HTMLDivElement;
  };

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
  height: 20%;
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
}

.body {
  overflow: auto;
  width: 100%;
  text-align: left;
  padding: 0rem 1rem;
}
</style>
