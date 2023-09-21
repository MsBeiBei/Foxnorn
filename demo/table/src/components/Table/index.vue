<script>
import { tableProps } from "../props";
import FTableColgroup from "../Colgroup/index.vue";

const FTableHeader = () => import("../Header/index.vue");
const FTableGroup = () => import("../Group/index.vue");
const FTableFilter = () => import("../Filter/index.vue");

export default {
  name: "FTable",
  props: tableProps,
  components: {
    FTableColgroup,
  },
  render(h) {
    const { showHeader, showGroup } = this.$props;

    return h(
      "div",
      {
        class: ["f-table"],
      },
      [
        showGroup && h(FTableGroup),

        h(
          "table",
          {
            class: ["f-table__wrapper"],
          },
          [h(FTableColgroup), showHeader && h(FTableHeader)]
        ),
      ]
    );
  },
};
</script>

<style lang="scss">
@import "../styles/index.scss";
</style>
