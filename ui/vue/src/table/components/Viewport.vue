<script>
export default {
  name: "Viewport",
  inheritAttrs: false,
  data() {
    return {
      width: 0,
      height: 0,
    };
  },
  created(){
 console.log(3456564);
  },
  mounted() {
    const observer = new ResizeObserver(() => {
      const el = this.$el;
      this.width = el.clientWidth;
      this.height = el.clientHeight;
      this.$emit("resize", el);
    });
    observer.observe(this.$el);
    console.log(3434);
    this.observer = observer;
  },
  beforeDestroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  },
  render() {

    const useSlot = () => {
      if (this.$slots.default) {
        return this.$slots.default;
      }
    };

    return <div class="fox-viewport">{useSlot()}</div>;
  },
};
</script>