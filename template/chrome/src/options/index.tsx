import { createApp } from "vue";
import Options from "./Options.vue";

function bootstrap() {
  const optionsContainer = document.querySelector("#options-container");
  if (!optionsContainer) {
    throw new Error("Can not find #app-container");
  }
  const options = createApp(Options);
  options.mount(optionsContainer);
}

bootstrap();
