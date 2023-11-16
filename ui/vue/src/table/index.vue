<template>
  <div
    class="fox-table fox-layout-normal"
    ref="root"
    tabindex="0"
    @scroll.stop.passive="onScroll"
  >

    <div class="fox-virtual-panel" ref="panel" :style="{ width, height }"></div>
    <div class="fox-scroll-table-clip" ref="clip">
      <table>
        <tbody>
          <Row tag="tr" v-for="(cells, ridx) in data" :key="ridx">
            <Cell
              tag="td"
              :ridx="ridx"
              :cidx="cidx"
              :width="model.fetch_cell_width(cidx)"
              :height="model.fetch_cell_width(ridx)"
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
import { useResizeEffect } from "./hooks/useResizeEffect";
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
    data() {
      return this.render(this.range) ?? [];
    },
  },
  methods: {
    onScroll(event) {
      this.model.offset = {
        top: event.target.scrollTop,
        left: event.target.scrollLeft,
      };
    },
  },
  created() {
    const { ncols, nrows } = this;
    this.model = new Table(ncols, nrows);
    this.resizer = useResizeEffect(this.model);
  },
  mounted() {
    const root = this.$refs.root;

    if (this.resizer) {
      this.stopObserve = this.resizer.observeRoot(root);
    }
  },
  beforeDestroy() {
    if (this.stopObserve) {
      this.stopObserve();
    }
  },
};
</script>