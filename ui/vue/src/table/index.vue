<script>
import Row from "./components/Row.vue";
import Cell from "./components/Cell.vue";
import { Table } from "./model/table";

export default {
  name: "Table",
  inheritAttrs: false,
  components: {
    Row,
    Cell,
  },
  props: {
    ncols: Number,
    nrows: Number,
    mode: {
      type: String,
      validator(value) {
        return ["both", "vertical", "horizontal", "none"].includes(value);
      },
      default: "both",
    },
  },
  created() {
    this.model = new Table();
  },
  render() {
    return (
      <div
        class="fox-table fox-layout-normal"
        ref="table"
        role="table"
        tabindex="0"
      >
        <div class="fox-virtual-panel" ref="panel"></div>

        <div class="fox-scroll-table-clip" ref="clip"></div>
      </div>
    );
  },
};
</script>

<style lang="scss" scoped>
.fox-table {
  overflow: auto;
  position: relative;
}

.fox-virtual-panel {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  pointer-events: none;
}

.fox-scroll-table-clip {
  position: sticky;
  contain: strict;
  width: 100%;
  height: 100%;
}
</style>