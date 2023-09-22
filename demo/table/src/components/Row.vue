<script>
import FGridCell from "./Cell.vue";
import { rowProps } from "./props";

export default {
  name: "FGridRow",
  props: rowProps,
  components: {
    FGridCell,
  },
  render() {
    return <div class="f-grid-row" role="role"></div>;
  },
};
</script>
