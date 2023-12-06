import { defineComponent } from "vue";
import { RouterView } from "vue-router";

export const App = defineComponent({
  name: "App",
  setup() {
    return () => <RouterView />;
  },
});
