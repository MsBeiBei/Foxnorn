<script>
export default {
  name: "Row",
  inheritAttrs: false,
  props: {
    id: String,
    tag: {
      type: String,
      default: "div",
    },
    idx: Number,
  },
  render(h) {
    const { tag, idx, id } = this;

    const useRowAttrs = () => {
      return {
        rowIndex: idx,
        rowId: id ?? idx,
        ...this.$attrs,
      };
    };

    return h(
      tag,
      {
        class: ["fox-row"],
        attrs: useRowAttrs(),
      },
      this.$slots.default
    );
  },
};
</script>