<template>
  <div style="width: 100vw; height: 100vh; border: 1px solid red">
    <!-- <Grid :viewData="viewData" :rowSize="rowSize" :colSize="colSize" /> -->
    <button @click="click">asda</button>
    <div
      style="
        position: absolute;
        top: 50px;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 9999;
        background: white;
      "
    ></div>
    <iframe
      id="fa"
      :style="{
        zIndex: show ? 9999 : -9999,
      }"
      src="https://v2.cn.vuejs.org/"
      style="
        position: absolute;
        top:100px;
        left: 10%;
        right: 10%;
        width: 50vw;
        height: 50vh;
      "
    ></iframe>
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

  methods: {
    click() {
      this.show = true;

      this.$nextTick(() => {
        window.print();

        this.show = false;
      });
    },
  },
};
</script>
