const FThead = () => import("./thead")
const FTbody = () => import("./tbody")
const FTfoot = () => import("./tfoot")

export default {
    name: 'FTable',
    render() {
        return (
            <div class="f-table">
                <FThead />

                <FTbody />

                <FTfoot />
            </div>
        )
    }
}