import Vue from "vue";

import App from "./App.vue";
import { Main } from "./scripts/UI/Main";

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");

window.addEventListener("load", function() {
  new Main();
});
