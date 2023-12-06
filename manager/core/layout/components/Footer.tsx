import { defineComponent } from "vue";

export const Footer = defineComponent({
  name: "LayoutFooter",
  setup(_props, { slots }) {
    return () => <footer>{slots["default"]?.()}</footer>;
  },
});
