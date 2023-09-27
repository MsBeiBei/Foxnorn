import "./style/index.scss"

import Layout from './mixins/layout'
import Virtual from './mixins/virtual'

export const props = {
    columns: {
        type: Array,
        default: () => ([])
    },
    data: {
        type: Array,
        default: () => ([])
    },
    virtualMode: {
        type: String,
        default: 'both',
        validator(value) {
            return ['both', 'none', 'vertical', 'horizontal'].includes(value)
        }
    }
}

export default {
    name: 'FDataGrid',
    mixins: [
        Layout,
        Virtual
    ],
    provide() {
        return {
            root: this
        }
    },
    render() {
        return (
            <div class="f-data-grid">
                <div class="f-virtual-panel"></div>
            </div>
        )
    }
}