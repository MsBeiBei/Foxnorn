<script>
import { isRTLDocument, toPx } from "../utilties/web";

export default {
  name: "Cell",
  inheritAttrs: false,
  props: {
    element: {
      type: String,
      default: "div",
    },
    rowIndex: Number,
    colIndex: Number,
    top: Number,
    left: Number,
    height: Number,
    width: Number,
    visibility: {
      type: String,
      validator(value) {
        return ["hidden", "visible"].includes(value);
      },
      default: "visible",
    },
  },

  render(h) {
    const { element, top, left, height, width, visibility } = this;

    return h(
      element,
      {
        class: ["msp-grid-cell"],
        style: {
          top: top,
          [isRTLDocument() ? "right" : "left"]: left,
          visibility: visibility,
          minHeight: toPx(height),
          minWidth: toPx(width),
        },
      },
      this.$slots.default
    );
  },
};
</script>

<style lang="scss" scoped>
.msp-grid-cell {
  display: grid;
  margin: 0;
  padding: 0;
  position: absolute;
}
</style>