import { defineComponent } from "vue";
import { Layout } from "@app/components";

const BaseLayout = defineComponent({
  name: "BaseLayout",
  setup() {
    return () => <Layout />;
  },
});

export default BaseLayout;
