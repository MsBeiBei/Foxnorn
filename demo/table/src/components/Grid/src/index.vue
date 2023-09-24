<script>
import FGridScroller from "./Scroller.vue";
import { baseProps, gridProps } from "./props";

const props = {
  ...baseProps,
  ...gridProps,
};

const convertToPx = (value) =>
  typeof value === "number" ? parseInt(value).toFixed(2) + "px" : "100%";

export default {
  name: "FGrid",
  props,
  render(h) {
    const width = convertToPx(this.width);
    const height = convertToPx(this.height);

    const styled = {
      width,
      height,
    };

    return (
      <div class="f-grid" role="grid" style={styled}>
        <FGridScroller>12312</FGridScroller>
      </div>
    );
  },
};
</script>

<style lang="scss" scoped>
.f-grid {
  border: 1px solid red;
}
</style>
