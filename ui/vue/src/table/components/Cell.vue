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
  },
  mounted() {
    const { ridx, cidx } = this;
    const el = this.$el;
    this.root.updateCellSize({
      ridx,
      cidx,
      width: el.offsetWidth,
      height: el.offsetHeight,
    });
  },
  render(h) {
    const { tag } = this;

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
      },
      this.$slots.default
    );
  },
};
</script>