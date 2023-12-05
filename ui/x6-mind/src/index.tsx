import "@/plugins/uno.css";
import "@/styles/index.less"

import { createApp } from "vue";
import App from "./App.vue";

async function bootstrap() {
  const app = createApp(App);

  app.mount("#app");
}

bootstrap();
