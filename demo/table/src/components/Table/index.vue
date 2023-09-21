<script>
import { tableProps } from "../props";

export default {
  name: "FTable",
  props: tableProps,
  components: {
    FRowGroup: () => import("../RowGroup/index.vue"),
    FHeader: () => import("../Header/index.vue"),
    FFilter: () => import("../Filter/index.vue"),
  },
  render() {
    const renderRowGroup = () => {
      const { showRowGroup } = this.$props;

      if (showRowGroup) {
        return <FRowGroup />;
      }
    };

    const renderHeader = () => {
      const { showHeader } = this.$props;

      if (showHeader) {
        return <FHeader />;
      }
    };

    const renderFilter = () => {
      const { showFilter } = this.$props;

      if (showFilter) {
        return <FFilter />;
      }
    };

    return (
      <div class="f-table">
        {renderRowGroup()}
        {renderHeader()}
        {renderFilter()}
      </div>
    );
  },
};
</script>

<style lang="scss" >
@import "../styles/index.scss";
</style>