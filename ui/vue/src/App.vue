<template>
  <div style="width: 500px; height: 600px; border: 1px solid red">
    <Table :render="render" :ncols="1000" :nrows="200000000000" />
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
      render: ({ startCol, endCol, startRow, endRow }) =>
        Array.from(Array(endRow - startRow).keys()).map((ridx) =>
          Array.from(Array(endCol - startCol).keys()).map(cidx => new Intl.NumberFormat("en-us").format(ridx + cidx))
        ),
    };
  },
};
</script>
