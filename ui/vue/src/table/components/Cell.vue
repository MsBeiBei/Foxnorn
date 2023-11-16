<script>
export default {
  name: "Cell",
  inheritAttrs: false,
  inject: ["root"],
  props: {
    tag: {
      type: String,
      default: "div",
    },

    ridx: Number,
    cidx: Number,

    height: Number,
    width: Number,
  },
  mounted() {
    const el = this.$el;
    if (this.root.resizer && el) {
      const { ridx, cidx } = this;

      this.destroy = this.root.resizer.observeItem(el, ridx, cidx);
    }
  },
  beforeDestroy() {
    if (this.destroy) {
      this.destroy();
    }
  },
  render(h) {
    const { tag, height, width } = this;

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
          minHeight: height,
          minWidth: width,
        },
      },
      this.$slots.default
    );
  },
};
</script>