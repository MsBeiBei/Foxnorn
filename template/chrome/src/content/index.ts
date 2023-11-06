import { createApp } from "vue";
import Content from "./Content.vue";

const root = document.createElement("div");
root.id = "chrome-extension-vue-vite-root";

document.body.append(root);

const rootIntoShadow = document.createElement("div");
rootIntoShadow.id = "shadow-root";

const shadowRoot = root.attachShadow({ mode: "open" });
shadowRoot.appendChild(rootIntoShadow);

createApp(Content).mount(rootIntoShadow);
