<template>
  <div class="demo">
    <h6>Example 1</h6>
    <div class="demo-1">
      <FTable />
    </div>
  </div>
</template>

<script>
import FTable from "@/components/Table";
export default {
  name: "App",
  components: {
    FTable,
  },
  data() {
    return {
      source_data: [],

      column_headers: [],

      row_headers: [],
    };
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
  position: relative;
}
</style>
