<script>
export default {
  name: "Table",
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
  render() {
    return <div class="fox-grid" ref="grid" role="table"></div>;
  },
};
</script>

<style lang="scss" scoped>
</style>