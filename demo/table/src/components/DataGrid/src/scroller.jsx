const props = {
    width: Number,
    height: Number
}

const convertToPx = (value) => `${value}px`

export default {
    name: 'FScrollPanel',
    props,
    render(h) {
        const width = convertToPx(this.width)
        const height = convertToPx(this.height)

        const styled = {
            width,
            height
        }

        const attrs = {
            tabIndex: -2,
        }


        return h('div', {
            class: "f-scroll-panel",
            attrs,
            style: styled
        })
    }
}

