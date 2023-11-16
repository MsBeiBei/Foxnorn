<script>
import Row from "./components/Row.vue";
import Cell from "./components/Cell.vue";
import { useScrollEffect } from "./hooks/useScrollEffect";
import { Table } from "./model/table";

export default {
  name: "Table",
  inheritAttrs: false,

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
  data() {
    return {
      model: null,
    };
  },
  computed: {
    width() {
      return this.model.width + "px";
    },
    height() {
      return this.model.height + "px";
    },
    range() {
      return this.model.range;
    },
  },
  created() {
    const { ncols, nrows } = this;
    this.model = new Table(ncols, nrows);
    this.observer = useScrollEffect(this.model);
  },
  mounted() {
    const root = this.$refs.root;
    const clip = this.$refs.clip;
    this.model.viewport = {
      clientWidth: clip.clientWidth,
      clientHeight: clip.clientHeight,
    };

    this.observer.observe(root);
  },
  beforeDestroy() {
    this.observer.destroy();
  },
  render() {
    const { width, height, range } = this;

    const rows = [];

    for (let rowIndex = range.startRow; rowIndex <= range.endRow; rowIndex++) {
      let cells = [];

      for (
        let colIndex = range.startCol;
        colIndex <= range.endCol;
        colIndex++
      ) {
        cells.push(
          <Cell tag="td">
            {rowIndex} * {colIndex}
          </Cell>
        );
      }

      rows.push(<Row tag="tr">{cells}</Row>);
    }

    return (
      <div class="fox-table fox-layout-normal" ref="root" tabindex="0">
        <div
          class="fox-virtual-panel"
          ref="panel"
          style={{ width, height }}
        ></div>

        <div class="fox-scroll-table-clip" ref="clip">
          <table border="1">
            <tbody>{rows}</tbody>
          </table>
        </div>
      </div>
    );
  },
};
</script>