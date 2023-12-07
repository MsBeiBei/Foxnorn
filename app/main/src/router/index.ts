import { type App } from "vue";
import { createRouter, createWebHistory } from "vue-router";

const { VITE_BASE_URL } = import.meta.env;

export const router = createRouter({
  history: createWebHistory(VITE_BASE_URL),
  routes: [],
});

export async function setupRouter(app: App) {
  app.use(router);

  await router.isReady();
}
