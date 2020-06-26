<template>
  <div id="app">
    <div id="progress">
      <div id="progCursor">
        &gt;
      </div>
    </div>
    <div id="gameScreen"></div>
    <Inventory :game="game"></Inventory>
    <div id="tooltip"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import Inventory from "./components/Inventory.vue";
import { Game } from "./scripts/Core/Game";
import { Main } from "./scripts/UI/Main";

@Component({
  components: { Inventory }
})
export default class App extends Vue {
  private game: Game;

  constructor() {
    super();

    this.game = new Game();
  }

  mounted() {
    new Main(this.game);
  }
}
</script>

<style lang="scss">
@import "./assets/main.css";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  height: 100%;

  margin: 0;
  padding: 1rem;

  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: center;
  overflow: hidden;
}
</style>
