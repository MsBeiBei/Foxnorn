<script>
import { isRTLDocument } from "../utilties/web";

export default {
  name: "Cell",
  inheritAttrs: false,
  props: {
    id: String,
    tag: {
      type: String,
      default: "div",
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
  mounted() {
    const { resizer } = this.$parent;
    const el = this.$el;

    if (this.resizer) {
      resizer.observeItem(el);
    }
  },
  render(h) {
    const { tag, top, left, height, width, visibility } = this;

    const useCellAttrs = () => {
      return {
        tabindex: -1,
        ...this.$attrs,
      };
    };

    return h(
      tag,
      {
        class: ["fox-cell"],
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