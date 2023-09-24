<template>
  <div class="demo">
    <h6>Example 1</h6>
    <div class="demo-1">
      <FDataGrid/>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  components: {
    FDataGrid:()=>import("./components/DataGrid")
  },
  created() {},
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
