import * as styled from "./icon.css";

import { defineComponent } from "vue";

export const Icon = defineComponent({
  name: "Icon",
  setup() {
    return () => <a class={styled.base}>1</a>;
  },
});
