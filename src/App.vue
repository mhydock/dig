<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Play Dig!</router-link> |
      <router-link to="/tools">Tool Editor</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view />
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: black;

  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}

#nav {
  border-bottom: 1px solid #ddd;

  position: relative;
  padding: 1rem;
  width: 100%;
  height: 2rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  flex: 0 0 auto;

  a {
    display: inline-block;
    text-decoration: none;
    position: relative;
    font-weight: bold;
    color: #2c3e50;
    text-shadow: 0px 2px 0px #fff, 2px 0px 0px #fff, 0px -2px 0px #fff,
      -2px 0px 0px #fff;

    &.router-link-exact-active,
    &:hover {
      color: black;

      &::before {
        width: 100%;
      }
    }

    &::before {
      content: "";
      background: black;
      display: block;
      position: absolute;
      bottom: -2px;
      height: 2px;
      width: 0%;
      z-index: -1;
      transition: width 0.1s;
    }
  }
}
</style>
