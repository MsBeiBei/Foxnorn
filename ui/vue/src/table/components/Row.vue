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
        role: "tablerow",
        rowIndex: idx,
        rowId: id ?? idx,
        ...this.$attrs,
      };
    };

    return h(
      tag,
      {
        attrs: useRowAttrs(),
      },
      this.$slots.default
    );
  },
};
</script>