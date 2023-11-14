<template>
  <div style="width: 500px; height: 600px; border: 1px solid red">
    <Table :data="data" />
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
      show: false,
      rowSize: 26,
      colSize: 4,
      data: [
        [0, 1, 2, 3, 4, 5],
        ["A", "B", "C", "D", "E", "F"],
        [true, false, true, false, true, false],
      ],
    };
  },
};
</script>
