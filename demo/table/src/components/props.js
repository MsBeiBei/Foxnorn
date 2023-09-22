export const tableProps = {
    showGroup: {
        type: Boolean,
        default: true
    },
    showHeader: {
        type: Boolean,
        default: true
    },
    showFilter: {
        type: Boolean,
        default: true
    },
    showToolbar: {
        type: Boolean,
        default: true
    },
    showFooter: {
        type: Boolean,
        default: true
    },
    columns: {
        type: Array,
        default: () => ([])
    },
    rows: {
        type: Array,
        default: () => ([])
    },
    width: Number,
    height: Number
}

export const headerProps = {
    columns: {
        type: Array,
        default: () => ([])
    }
}

export const rowProps = {
    row: {
        type: Object,
        default: () => ({})
    },
    rowId: {
        type: String,
        default: ''
    }
}

export const cellProps = {
    column: {
        type: Object,
        default: () => ({})
    },
    row: {
        type: Object,
        default: () => ({})
    },
    level: Number
}