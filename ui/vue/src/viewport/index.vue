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
  mounted() {
    const el = this.$el;
    const observer = new ResizeObserver(() => {
      this.width = el.clientWidth;
      this.height = el.clientHeight;
    });
    observer.observe(el);

    this.observer = observer;
  },
  beforeDestroy() {
    this.observer.disconnect();
    this.observer = undefined;
  },
  render() {
    const { width, height } = this;

    return (
      <div class="fox-viewport">
        {this.$scopedSlots.default({ width, height })}
      </div>
    );
  },
};
</script>

<style lang="scss" scoped>
.fox-viewport {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
