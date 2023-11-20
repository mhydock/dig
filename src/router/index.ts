import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

import AboutPage from "../views/AboutPage.vue";
import GameView from "../views/GameView.vue";
import ToolEdit from "../views/ToolEdit.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Game",
    component: GameView,
  },
  {
    path: "/tools",
    name: "Tool Editor",
    component: ToolEdit,
  },
  {
    path: "/about",
    name: "About",
    component: AboutPage,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
