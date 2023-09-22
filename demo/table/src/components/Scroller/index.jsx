export default {
  name: "Scroller",
  props: {
    move: Number,
    size: {
      type: Number,
      default: 10,
      validator(value) {
        const number = Number(value);
        return number < 18 && number >= 10;
      },
    },
  },
  render() {
    return (
      <div class="scroller">
        <div class="scroller__body"></div>
      </div>
    );
  },
};
