<template>
  <div class="demo">
    <h6>Example 1</h6>
    <div class="demo-1">
      <FGrid class="13123"/>
    </div>
  </div>
</template>

<script>
import FGrid from "./components/Grid.vue";
import { Table } from "./components/table.jsx";
import { columns } from "./demo-data";

export default {
  name: "App",
  components: {
    FGrid,
  },
  created() {
    Table.convertColumns(columns);
  },
};
</script>

<style lang="scss">
@mixin size {
  width: 100%;
  height: 100%;
}

html,
body {
  @include size();
  padding: 0 !important;
  margin: 0;
  overflow: hidden;

  * {
    box-sizing: border-box;
  }

  .demo {
    @include size();
    position: relative;
  }
}

.demo-1 {
  width: 80%;
  height: 500px;
}
</style>
