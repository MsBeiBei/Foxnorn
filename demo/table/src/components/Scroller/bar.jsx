export default {
  name: "Bar",
  props: {
    vertical: Boolean,
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
  render(){

  }
};
