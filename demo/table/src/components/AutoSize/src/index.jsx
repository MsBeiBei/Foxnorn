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
            const rect = this.$el.getBoundingClientRect()

            this.width = rect.width
            this.height = rect.height
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
        const { width, height } = this

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