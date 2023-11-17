<template>
  <div
    class="fox-table fox-layout-normal"
    ref="root"
    tabindex="0"
    @scroll.stop.passive="onScroll"
  >
    <div class="fox-virtual-panel" ref="panel"></div>
    <div class="fox-scroll-table-clip" ref="clip">
      <table>
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
      range: null,
    };
  },
  computed: {
    data() {
      return this.render(this.range);
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
    this.model = new Table({ ncols, nrows }, (range) => {
      this.range = range;
    });
    this.resizer = useResizeEffect(this.model);
  },
  mounted() {
    if (this.resizer) {
      const el = this.$el;
      this.destroyObserve = this.resizer.observeRoot(el);
    }
  },
  beforeDestroy() {
    if (this.destroy) {
      this.destroyObserve();
    }
  },
};
</script>