<template>
  <FTable />
</template>

<script>
import FTable from "./components/Table/index.vue";

export default {
  name: "App",
  components: {
    FTable,
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
  padding: 0;
  margin: 0;

  * {
    box-sizing: border-box;
  }
}
</style>


