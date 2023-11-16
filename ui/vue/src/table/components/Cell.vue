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
    if (typeof ResizeObserver !== "undefined") {
      this.observer = new ResizeObserver(() => {
        const { ridx, cidx } = this;
        this.root.updateCell(ridx, cidx, [
          this.$el.offsetWidth,
          this.$el.offsetHeight,
        ]);
      });
      this.observer.observe(this.$el);
    }
  },
  beforeDestroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
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