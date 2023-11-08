<template>
  <div class="msp-grid" ref="grid"></div>
</template>

<script>
import { gridProps } from "./props";
import Layout from "./mixins/layout";

export default {
  name: "Grid",
  mixins: [Layout],
  provide() {
    return {
      root: this,
    };
  },
  props: gridProps,
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
</style>