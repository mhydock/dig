import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

import AboutPage from "../views/AboutPage.vue";
import GameView from "../views/GameView.vue";
import ToolEdit from "../views/ToolEdit.vue";

const routes: Array<RouteRecordRaw> = [
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

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
