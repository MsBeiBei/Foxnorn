import { createApp } from "vue";
import { createWebHistory, createRouter } from "vue-router";
import { App } from "./App";
import Home from "./features/Home/index";

let app: any;
let router: any;
let history: any;

history = createWebHistory(
  "/vite/"
);
router = createRouter({
  history,
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home,
    },
  ],
});

app = createApp(App);
app.use(router);
app.mount("#app");

console.log((window as any).__MICRO_APP_BASE_ROUTE__)