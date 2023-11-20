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
      <Row v-for="(cells, ridx) in data" :key="ridx">
        <Cell
          :ridx="ridx"
          :cidx="cidx"
          v-for="(cell, cidx) in cells"
          :key="ridx + cidx"
        >
          {{ cell * 30000 }}
        </Cell>
      </Row>
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
      virtualSize: { width: 20000000, height: 10000 },
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
    this.table = new Table({ ncols, nrows }, (range) => {
      this.range = range;
    });

    console.log(this.table);
  },
  mounted() {
    this.updateViewport();
  },
};
</script>