import './style/index.scss';

import FScrollPanel from './scroller'
import FTable from './table'
import FAutoSize from '@/components/AutoSize'


export const props = {
    sourceData: {
        type: Array,
        default: () => ([])
    },
    virtualModel: {
        type: String,
        default: 'none',
        validator(value) {
            return ['both', 'none', 'vertical', 'horizontal'].includes(value)
        }
    }
}

export default {
    name: 'FDataGrid',
    props,
    computed: {

    },
    methods: {
        calculateVirtualWidth() {

        },
        calculateVirtualHeight() {

        },
    },
    render() {
        return (
            <FAutoSize class="f-data-grid" tabIndex={0} role="grid">
                <FScrollPanel />

                <div class="f-data-grid__clip">
                    <FTable />
                </div>
            </FAutoSize>
        )
    }
}