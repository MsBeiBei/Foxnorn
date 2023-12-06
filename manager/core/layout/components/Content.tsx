import { defineComponent } from "vue";
import { ContentStyle } from "../styles/layout.css";

export const Content = defineComponent({
  name: "LayoutContent",
  setup(_props, { slots }) {
    return () => <main class={ContentStyle}>{slots["default"]?.()}</main>;
  },
});
