<script>
const props = {
  id: {
    type: [String, Number],
    required: true,
  },
  row: {
    type: Object,
    default: () => ({}),
  },
  column: {
    type: Object,
    default: () => ({}),
  },
  value: [String, Number],
  render: Function,
  tag: {
    type: String,
    default: "div",
  },
};

export default {
  name: "FBaseCell",
  props,
  inheritAttrs: false,
  render(h) {
    const { render, value } = this.$props;

    const renderChild = () => {
      if (render && typeof render === "function") {
        return render(value, row, column);
      }

      return value;
    };

    const { id, tag } = this.$props;

    const attrs = {
      ...this.$attrs,
      tabindex: -1,
      "col-id": id,
    };

    return h(
      tag,
      {
        class: "f-base-cell",
        attrs,
      },
      renderChild()
    );
  },
};
</script>
