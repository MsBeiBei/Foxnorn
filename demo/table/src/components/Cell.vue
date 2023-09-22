<script>
import { cellProps } from "./props";

export default {
  name: "FGridCell",
  inheritAttrs: false,
  props: cellProps,
  render() {
    return <div class="f-grid-cell" role="cell" tabindex={-2}></div>;
  },
};
</script>
