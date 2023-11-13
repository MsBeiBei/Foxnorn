<script>
import { genKey } from "../utilties/key";
import Cell from "./Cell.vue";
import Row from "./Row.vue";

const key = genKey("body");

const map = (items, ridx, element) =>
  items.map((_, cidx) => element(ridx, cidx));

export default {
  name: "Body",
  components: {
    Cell,
    Row,
  },
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    headers: {
      type: Array,
      default: () => [],
    },
  },
  render(h) {
    const { data, headers } = this;

    const td = (ridx, cidx) =>
      h(
        Cell,
        {
          key: key("td", ridx, cidx),
          props: {
            element: "td",
            rowIndex: ridx,
            colIndex: cidx,
          },
        },
        data[ridx][cidx]
      );

    const th = (ridx, cidx) =>
      h(
        Cell,
        {
          key: key("th", ridx, cidx),
          props: {
            element: "th",
            rowIndex: ridx,
            colIndex: cidx,
          },
        },
        headers[ridx][cidx]
      );

    const tr = (ridx) =>
      h(
        Row,
        {
          key: key("row", ridx),
        },
        [map(headers, ridx, th), map(data, ridx, td)]
      );

    const rows = data.map((_, ridx) => tr(ridx));

    return h("tbody", null, rows);
  },
};
</script>