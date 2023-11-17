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
    if (this.root.resizer) {
      const el = this.$el;

      this.destroyObserve = this.root.resizer.observeRoot(el);
    }
  },
  beforeDestroy() {
    if (this.destroyObserve) {
      this.destroyObserve();
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