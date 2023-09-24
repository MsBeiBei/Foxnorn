<script>
import { baseProps, gridProps } from "./props";

const props = {
  ...baseProps,
  ...gridProps,
};

const convertToPx = (value) =>
  typeof value === "number" ? parseInt(value).toFixed(2) + "px" : "100%";

export default {
  name: "FDataGrid",
  props,
  render(h) {
    const width = convertToPx(this.width);
    const height = convertToPx(this.height);

    const styled = {
      width,
      height,
    };

    return <div class="f-data-grid" role="grid" style={styled}></div>;
  },
};
</script>

<style lang="scss" scoped>
.f-data-grid {
  border: 1px solid red;
}
</style>
