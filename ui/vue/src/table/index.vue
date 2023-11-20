<script>
import Cell from "./components/Cell.vue";
import Row from "./components/Row.vue";
import { Table } from "./model/table";

export default {
  name: "Table",
  inheritAttrs: false,
  components: {
    Cell,
    Row,
  },
  provide() {
    return {
      root: this,
    };
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
    render: {
      type: Function,
      default: () => [],
      required: true,
    },
  },
  data() {
    return {
      range: { startCol: 0, endCol: 0, startRow: 0, endRow: 0 },
      size: { width: 0, height: 0 },
    };
  },

  methods: {
    onScroll(event) {
      this.table.offset = {
        top: event.target.scrollTop,
        left: event.target.scrollLeft,
      };
    },

    updateViewport() {
      const clip = this.$refs.clip;
      this.table.viewport = [clip.clientWidth, clip.clientHeight];
    },

    saveSize(cell) {
      this.table.cell = cell;
    },
  },
  created() {
    const { ncols, nrows } = this;
    this.table = new Table({ ncols, nrows }, (range, size) => {
      this.range = range;
      this.size = size;
    });

    console.log(this.table)
  },
  mounted() {
    this.updateViewport();
  },
  render() {
    const { onScroll, size, range } = this;

    let rows = [];

    for (let rowIndex = range.startRow; rowIndex <= range.endRow; rowIndex++) {
      let cells = [];
      for (
        let colIndex = range.startCol;
        colIndex <= range.endCol;
        colIndex++
      ) {
        cells.push(
          <Cell ridx={rowIndex} cidx={colIndex} key={rowIndex + colIndex}>
            {rowIndex}/{colIndex}
          </Cell>
        );
      }

      rows.push(<Row>{cells}</Row>);
    }

    return (
      <div
        class="fox-table fox-layout-normal"
        ref="root"
        tabindex="0"
        onScroll={onScroll}
      >
        <div
          class="fox-virtual-panel"
          ref="panel"
          style={{
            width: size.width + "px",
            height: size.height + "px",
          }}
        ></div>
        <div class="fox-scroll-table-clip" ref="clip">{rows}</div>
      </div>
    );
  },
};
</script>