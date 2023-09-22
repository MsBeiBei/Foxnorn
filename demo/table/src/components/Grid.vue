<script>
import AutoSize from "./AutoSize.vue";
import Scroller from "./Scroller";
import FGridRow from "./Row.vue";
import { tableProps } from "./props";

export default {
  name: "FGrid",
  inheritAttrs: false,
  props: tableProps,
  components: {
    AutoSize,
    Scroller,
    FGridRow,
  },
  data() {
    return {
      row: {},
    };
  },
  render() {
    const convertPx = (value) => `${value}px`

    const style = (size) => {
      const { width, height } = this;

      return {
        width: (width || size.width) + "px",
        height: (height || size.height) + "px",
      };
    };

    return (
      <AutoSize
        scopedSlots={{
          default: (size) => {
            return (
              <div class="f-grid" role="gird" style={style(size)}>
                <FGridRow />
              </div>
            );
          },
        }}
      />
    );
  },
};
</script>

<style lang="scss">
@import "./styles/index.scss";
</style>
