<template>
  <div style="width: 470px; height: 300px; border: 1px solid red">
    <Table :render="render" :ncols="100" :nrows="100000" />
  </div>
</template>

<script>
import Table from "./table";

export default {
  name: "App",
  components: {
    Table,
  },

  data() {
    return {
      render(range) {
        const { startCol, endCol, startRow, endRow } = range ?? {};

        function range12(x0, x1, f) {
          return Array.from(Array(x1 - x0).keys()).map((x) => f(x + x0));
        }

        return range12(startRow, endRow, (x) =>
          range12(startCol, endCol, (y) => x + y)
        );
      },
    };
  },
};
</script>
