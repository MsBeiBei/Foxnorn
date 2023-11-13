<script>
import Cell from "./Cell.vue";
import Row from "./Row.vue";

export default {
  name: "Header",
  components: {
    Cell,
    Row,
  },
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
  render(h) {
    return h("thead", null);
  },
};
</script>