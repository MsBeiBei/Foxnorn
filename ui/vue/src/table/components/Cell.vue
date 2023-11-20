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
    this.root.saveSize({
      ridx,
      cidx,
      width: el.clientWidth,
      height: el.clientHeight,
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