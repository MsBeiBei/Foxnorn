<script>
import Viewport from "./components/Viewport.vue";
import Row from "./components/Row.vue";
import Cell from "./components/Cell.vue";
import { useStoreEffect } from "./hooks/useStoreEffect";
import { useResizeEffect } from "./hooks/useResizeEffect";

export default {
  name: "Table",
  components: {
    Viewport,
    Row,
    Cell,
  },
  data() {
    return {
      hs: null,
      ws: null,
      resizer: null,
    };
  },
  created() {
    this.hs = useStoreEffect();
    this.ws = useStoreEffect();
    this.resizer = useResizeEffect();
  },
  mounted(){
    console.log(23232)
  },
  beforeDestroy() {
    if (this.stop) {
      this.stop();
    }
  },
  render() {
    return (
      <Viewport class="fox-grid" ref="grid" role="table">
        <Cell />
      </Viewport>
    );
  },
};
</script>

<style lang="scss" scoped>
</style>