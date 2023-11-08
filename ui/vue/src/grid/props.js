export const gridProps = {
    rowSize: Number,
    colSize: Number,
    rowHeader: {
        type: Array,
        default: () => ([])
    },
    colHeader: {
        type: Array,
        default: () => ([])
    },
    viewData: {
        type: Array,
        default: () => ([])
    }
}