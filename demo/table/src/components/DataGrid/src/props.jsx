export const baseProps = {
  width: Number,
  height: Number,
  estimatedRowHeight: {
    type: Number,
    default: 30,
  },
  estimatedColumnWidth: {
    type: Number,
    default: 90,
  },
};

export const gridProps = {
  sourceData: {
    type: Array,
    default: () => [],
  },
  columnHeaders: {
    type: Array,
    default: () => [],
  },
  rowHeaders: {
    type: Array,
    default: () => [],
  },
};
