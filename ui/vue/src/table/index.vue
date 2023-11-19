<template>
  <div
    class="fox-table fox-layout-normal"
    ref="root"
    tabindex="0"
    @scroll.stop.passive="onScroll"
  >
    <div
      class="fox-virtual-panel"
      ref="panel"
      :style="{
        width: virtualSize.width + 'px',
        height: virtualSize.height + 'px',
      }"
    ></div>
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
              {{ cell * 300 }}
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
      range: null,
      virtualSize: { width: 0, height: 0 },
    };
  },
  computed: {
    data() {
      return this.range ? this.render(this.range) : [];
    },
  },
  methods: {
    onScroll(event) {
      this.table.offset = {
        top: event.target.scrollTop,
        left: event.target.scrollLeft,
      };
    },
  },
  created() {
    const { ncols, nrows } = this;
    this.table = new Table({ ncols, nrows }, (range, size) => {
      this.range = range;
      this.virtualSize = size;
    });
  },
};
</script>