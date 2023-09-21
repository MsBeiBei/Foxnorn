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
    sourceData: {
        type: Array,
        default: () => ([])
    }
}

export const headerProps = {
    columns: {
        type: Array,
        default: () => ([])
    }
}