<script>
export default {
  name: "FGridScroller",
  render() {
    return (
      <div class="f-grid-scroller">
        {this.$slots.default ? this.$slots.default : null}
      </div>
    );
  },
};
</script>
