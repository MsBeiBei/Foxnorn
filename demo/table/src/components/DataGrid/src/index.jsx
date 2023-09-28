import "./style/index.scss"

export const props = {
    column_headers: {
        type: Array,
        default: () => ([])
    },
    row_headers: {
        type: Array,
        default: () => ([])
    },
    source_data: {
        type: Array,
        default: () => ([])
    },
    virtual_mode: {
        type: String,
        default: 'both',
        validator(value) {
            return ['both', 'none', 'vertical', 'horizontal'].includes(value)
        }
    },
}

export default {
    name: 'FDataGrid',
    mixins: [],
    provide() {
        return {
            root: this
        }
    },
    props,
    render() {
        return (
            <div class="f-data-grid">
                <div class="f-virtual-panel"></div>
            </div>
        )
    }
}