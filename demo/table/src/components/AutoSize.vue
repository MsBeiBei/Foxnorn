<script>
export default {
  name: "AutoSize",
  inheritAttrs: false,
  data() {
    return {
      width: 0,
      height: 0,

      observer: null,
    };
  },
  mounted() {
    const observer = new ResizeObserver(() => {
      const rect = this.$el.getBoundingClientRect();
      this.width = rect.width;
      this.height = rect.height;
    });
    observer.observe(this.$el);

    this.observer = observer;
  },
  beforeDestroy() {
    if (this.observer) {
      this.observer.unobserve(this.$el);
      this.observer.disconnect();
      this.observer = null;
    }
  },
  render() {
    const { width, height } = this;

    return (
      <div class="auto-size">
        {this.$scopedSlots.default({ width, height })}
      </div>
    );
  },
};
</script>

<style lang="scss" scoped>
.auto-size {
  height: 100%;
  height: 100%;
}
</style>
