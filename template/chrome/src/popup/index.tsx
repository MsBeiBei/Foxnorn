import { createApp } from "vue";
import Popup from "./Popup.vue";

function bootstrap() {
  const popupContainer = document.querySelector("#popup-container");
  if (!popupContainer) {
    throw new Error("Can not find #app-container");
  }
  const popup = createApp(Popup);
  popup.mount(popupContainer);
}

bootstrap();
