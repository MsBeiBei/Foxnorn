import { defineComponent, h } from "vue";
import { RouterView } from "vue-router";
import { Layout } from "@foxnorn/layout";
import { Menu } from "@foxnorn/ui";

export const App = defineComponent({
  name: "App",
  setup() {
    return () =>
      h(Layout, null, {
        default: () => h(RouterView),
        footer: () => h("div"),
        header: () => h("div"),
        slider: () => h(Menu),
      });
  },
});
