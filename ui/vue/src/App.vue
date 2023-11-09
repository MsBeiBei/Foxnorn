<template>
  <div style="width: 500px; height: 600px; border: 1px solid red">
    <Grid :viewData="viewData" :rowSize="rowSize" :colSize="colSize" />
  </div>
</template>

<script>
import Grid from "./grid";

export default {
  name: "App",
  components: {
    Grid,
  },
  data() {
    return {
      show: false,
      rowSize: 26,
      colSize: 4,
      viewData: [
        [0, 1, 2, 3, 4, 5],
        ["A", "B", "C", "D", "E", "F"],
        [true, false, true, false, true, false],
      ],
    };
  },
};
</script>
