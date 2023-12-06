import { defineComponent } from "vue";
import { SliderStyle } from "../styles/layout.css";

export const Slider = defineComponent({
  name: "LayoutSlider",
  setup(_props, { slots }) {
    return () => <aside class={SliderStyle}>{slots["default"]?.()}</aside>;
  },
});
