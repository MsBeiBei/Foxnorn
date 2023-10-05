import '../style/index.scss';

export const props = {
    col_headers: {
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
    name: 'FTable',
    props,
    render() {
        const renderCell = () => {
         
            

            return ['a'].map(i => {
                const el = <div>213</div>
                console.log(el.elm)
                return el
            })
        }

        return <div class="f-table">{renderCell()}</div>
    }
}