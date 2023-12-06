import { type App } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { basicRoutes } from "./routes";

export const router = createRouter({
  history: createWebHistory(),
  strict: true,
  routes: basicRoutes,
});

export function setupRouter(app: App<Element>) {
  app.use(router);
}
