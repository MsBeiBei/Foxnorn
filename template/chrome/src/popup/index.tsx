import { createApp } from "vue";
import Popup from "./Popup.vue";

function bootstrap() {
  const appContainer = document.querySelector("#app-container");
  if (!appContainer) {
    throw new Error("Can not find #app-container");
  }
  const popup = createApp(Popup);
  popup.mount(appContainer);

  
}

bootstrap();
