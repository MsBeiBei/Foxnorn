import * as styled from "./menu.css";

import { defineComponent } from "vue";
import { props } from "./menu.prop";

export const SubMenu = defineComponent({});

export const Menu = defineComponent({
  name: "Menu",
  props,
  setup() {
    return () => (
      <nav class={styled.base}>
        <div></div>
        <div></div>
      </nav>
    );
  },
});
