<template>
  <div id="app">
    <div id="progress">
      <div id="progCursor">
        &gt;
      </div>
    </div>
    <div id="gameScreen"></div>
    <div id="inventory">
      <ul class="tabs">
        <li id="tools">Tools</li>
        <li id="items">Items</li>
        <li id="econ">Econ</li>
      </ul>
      <div id="money"></div>
      <div class="content">
        <div id="toolsList"></div>
        <div id="itemsList"></div>
        <div id="econList">
          <ul class="tabs">
            <li id="tech">Technologies</li>
            <li id="busi">Businesses</li>
          </ul>
          <div class="content">
            <div id="techList"></div>
            <div id="busiList"></div>
          </div>
        </div>
      </div>
    </div>
    <div id="tooltip"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {}
})
export default class App extends Vue {}
</script>

<style lang="scss">
@import "./assets/main.css";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  margin: 0;
  padding: 1rem;

  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: center;
  overflow: hidden;
}
</style>
