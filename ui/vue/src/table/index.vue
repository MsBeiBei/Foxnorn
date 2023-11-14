<script>
import { useResizeEffect } from "./hooks/useResizeEffect";
import { useScrollEffect } from "./hooks/useScrollEffect";
import { Table } from "./model/table";
import Row from "./components/Row.vue";
import Cell from "./components/Cell.vue";

export default {
  name: "Table",
  inheritAttrs: false,
  components: {
    Row,
    Cell,
  },
  computed: {
    width() {
      return this.table.getVirtualWidth() + "px";
    },
    height() {
      return this.table.getVirtualHeight() + "px";
    },
  },
  created() {
    this.table = new Table();
    this.scroller = useScrollEffect(this.table);
    this.resizer = useResizeEffect(this.table);
  },
  mounted() {
    const el = this.$el;

    if (this.scroller) {
      this.scroller.observe(el);
    }
    
    if (this.resizer) {
      this.resizer.observeRoot(el);
    }
  },
  render() {
    const { width, height } = this;

    return (
      <div class="fox-table fox-layout-normal" ref="table" role="table">
        <div
          class="fox-virtual-panel"
          ref="panel"
          style={{ width, height }}
        ></div>

        <div class="fox-table-clip"></div>
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
</style>