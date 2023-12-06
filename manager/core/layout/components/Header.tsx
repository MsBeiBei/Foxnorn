import { defineComponent, Fragment } from "vue";
import { HeaderStyle } from "../styles/layout.css";

export const Header = defineComponent({
  name: "LayoutHeader",
  setup(_props, { slots }) {
    return () => (
      <Fragment>
        <header class={HeaderStyle}>{slots["default"]?.()}</header>
        <div
          style={{ height: "50px", flexShrink: 0, overflow: "hidden" }}
        ></div>
      </Fragment>
    );
  },
});
