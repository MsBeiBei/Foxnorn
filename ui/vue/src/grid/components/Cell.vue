<script>
import { isRTLDocument } from "../utilties/web";

export default {
  name: "Cell",
  inheritAttrs: false,
  props: {
    id: String,
    tag: {
      type: String,
      default: "td",
    },
    ridx: Number,
    cidx: Number,
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
    const { tag, top, left, height, width, visibility } = this;

    const useCellAttrs = () => {
      return {
        role: "gridcell",
        tabindex: -1,
        ...this.$attrs,
      };
    };

    return h(
      tag,
      {
        class: ["msp-grid-cell"],
        attrs: useCellAttrs(),
        style: {
          top: top,
          [isRTLDocument() ? "right" : "left"]: left,
          visibility: visibility,
          minHeight: height,
          minWidth: width,
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