
export default {
    data() {
        return {
            tableRect: null
        }
    },
    methods: {
        internalDraw() {

        },
        setTableRect() {
            const tableWrapper = this.$el
            if (!tableWrapper) return

            const { virtualMode } = this.$props
            this.tableRect = {
                width: virtualMode === "none" || virtualMode === "vertical" ? Infinity : tableWrapper.clientWidth,
                height: virtualMode === "none" || virtualMode === "horizontal" ? Infinity : tableWrapper.clientHeight,
            }
        },
        updateVirtualPanelHeight() {

        },

    }
}