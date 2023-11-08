<script>
export default {
  name: "Cell",
  props: {
    tag: {
      type: String,
      default: "div",
    },
  },
  render(h) {
    const { tag } = this;

    return h(tag, {
      class: ["msp-grid-cell"],
    });
  },
};
</script>