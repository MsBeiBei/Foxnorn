<script>
import Body from "./Body.vue";

export default {
  name: "Grid",
  components: {
    Body,
  },
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
  render() {
    const { data } = this;

    return (
      <div class="msp-grid" ref="grid">
        <table>
          <Body data={data} />
        </table>
      </div>
    );
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
</style>