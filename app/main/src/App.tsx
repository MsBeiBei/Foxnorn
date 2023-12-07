import { defineComponent } from "vue";
import { RouterView } from "vue-router";
import { NConfigProvider } from "naive-ui";
import { AppProvider } from "@/components/Application";

export const App = defineComponent({
  name: "App",
  setup() {
    return () => (
      <NConfigProvider>
        <AppProvider>
          <RouterView />
        </AppProvider>
      </NConfigProvider>
    );
  },
});
