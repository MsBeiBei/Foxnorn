<script>
import { genKey } from "../utilties/key";
import Cell from "./Cell.vue";

export default {
  name: "Grid",
  components: {
    Cell,
  },
  props: {},
  data() {
    return {
      store: null,
    };
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  render() {
    const cells = [];
    for (let rowIndex = 0; rowIndex <= 10; rowIndex++) {
      for (let colIndex = 0; colIndex <= 10; colIndex++) {
        cells.push(
          <Cell
            key={genKey(rowIndex, colIndex)}
            rowIndex={rowIndex}
            colIndex={colIndex}
          >
            {genKey(rowIndex, colIndex)}
          </Cell>
        );
      }
    }

    return (
      <div class="msp-grid" ref="grid">
        {cells}
      </div>
    );
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
</style>