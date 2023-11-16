<template>
  <div
    class="fox-table fox-layout-normal"
    ref="root"
    tabindex="0"
    @scroll.stop.passive="onScroll"
  >
    <div class="fox-virtual-panel" ref="panel" :style="{ width, height }"></div>
    <div class="fox-scroll-table-clip" ref="clip">
      <table border="1">
        <tbody>
          <Row tag="tr" v-for="(cells, ridx) in data" :key="ridx">
            <Cell
              tag="td"
              :ridx="ridx"
              :cidx="cidx"
              v-for="(cell, cidx) in cells"
              :key="ridx + cidx"
            >
              {{ cell * 600 }}
            </Cell>
          </Row>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import Cell from "./components/Cell.vue";
import Row from "./components/Row.vue";

export default {
  name: "Table",
  inheritAttrs: false,
  provide() {
    return {
      root: this,
    };
  },
  components: {
    Cell,
    Row,
  },
  props: {
    nrows: {
      type: Number,
      default: 0,
    },
    ncols: {
      type: Number,
      default: 0,
    },
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
    },
  },
  data() {
    return {
      csizes: { auto: [], override: [], indices: [] },
      rsizes: { auto: [], override: [], indices: [] },
      viewport: { width: 0, height: 0 },
      offset: { top: 0, left: 0 },
    };
  },
  computed: {
    width() {
      const { csizes, ncols } = this;
      return (
        csizes.indices.reduce(
          (x, y) => x + y,
          (ncols - csizes.indices.length) * 60
        ) + "px"
      );
    },
    height() {
      const { rsizes, nrows } = this;
      return (
        rsizes.indices.reduce(
          (x, y) => x + y,
          (nrows - rsizes.indices.length) * 60
        ) + "px"
      );
    },
    data(){
      return this.render(this.range)
    },
    range() {
      return this.getViewportRange();
    },
  },
  mounted() {
    const el = this.$el;
    this.viewport = { width: el.clientWidth, height: el.clientHeight };
    this.getViewportRange();
  },
  methods: {
    onScroll(event) {
      this.offset = {
        top: event.target.scrollTop,
        left: event.target.scrollLeft,
      };
      this.getViewportRange();
    },

    getViewportRange() {
      const { nrows, ncols, csizes, rsizes } = this;
      const { width, height } = this.viewport;
      const { top, left } = this.offset;
      const [startRow, endRow] = this.getRange(nrows, height, top, rsizes);
      const [startCol, endCol] = this.getRange(ncols, width, left, csizes);

      return {
        startCol,
        endCol,
        startRow,
        endRow,
      };
    },

    getRange(length, viewport, offset, sizes) {
      const startIndex = this.getStartIndex(offset, sizes);
   
      const visItems = Math.min(length, Math.ceil(viewport / 60));
      let endIndex = startIndex + visItems + 1;
      return [startIndex, endIndex];
    },

    getStartIndex(offset, sizes) {
      let startIndex = 0;
      let offsetSize = 0;
      let diff = 0;

      while (offsetSize < offset) {
        const new_val = sizes.indices[startIndex];
        diff = offset - offsetSize;
        startIndex += 1;
        offsetSize += new_val !== undefined ? new_val : 60;
      }

      startIndex += diff / (sizes.indices[startIndex] || 60);
      return Math.max(0, Math.ceil(startIndex - 1));
    },

    updateCell(ridx, cidx, [width, height]) {
      this.$set(this.rsizes, ridx, height);
      this.$set(this.csizes, cidx, width);
    },
  },
};
</script>