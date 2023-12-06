import { defineComponent, h } from "vue";
import { Header } from "./Header";
import { Content } from "./Content";
import { Slider } from "./Slider";
import { Footer } from "./Footer";
import { LayoutStyle } from "../styles/layout.css";

export const Layout = defineComponent({
  name: "Layout",
  setup(_props, { slots }) {
    return () =>
      h(
        "div",
        {
          class: [LayoutStyle],
        },
        [
          h(Header, null, slots["header"]),
          h(Slider, null, slots["slider"]),
          h(Content, null, slots["default"]),
          h(Footer, null, slots["footer"]),
        ]
      );
  },
});
