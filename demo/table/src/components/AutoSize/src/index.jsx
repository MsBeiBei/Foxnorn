import './style/index.scss'

export default {
    name: 'FAutoSize',
    data() {
        return {
            observer: null,

            width: 0,
            height: 0
        }
    },
    mounted() {
        const observer = new ResizeObserver(() => {
            const el = this.$el

            if (!el) return

            this.width = el.clientWidth
            this.height = el.clientHeight
        })
        observer.observe(this.$el)

        this.observer = observer
    },
    beforeDestroy() {
        if (this.observer) {
            this.observer.unobserve(this.$el)
            this.observer.disconnect()
        }
    },
    render() {
        const { width, height } = this.$data

        const getSlot = () => {
            if (this.$scopedSlots.default) {
                return this.$scopedSlots.default({ width, height })
            }
        }

        return (
            <div class="f-auto-size">
                {getSlot()}
            </div>
        )
    }
}