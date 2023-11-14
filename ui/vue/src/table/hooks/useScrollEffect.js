import { IS_SAFARI } from '../utilties/constants'

export function useScrollEffect() {
    let root

    const onScroll = (event) => {
        event.stopPropagation()
        console.log(223)
    }

    const onMousedown = () => {

    }

    const onMousewheel = (event) => {
        if (!IS_SAFARI) {
            return;
        }

        onScroll(event)
    }


    const observe = (target) => {
        root = target

        root.addEventListener("mousedown", onMousedown)
        root.addEventListener("scroll", onScroll, { passive: true, })
        root.addEventListener("mousewheel", onMousewheel)
    }

    const destroy = () => {
        root.removeEventListener("mousedown", onMousedown)
        root.removeEventListener("scroll", onScroll)
        root.removeEventListener("scroll", onMousewheel)
    }

    return {
        observe,
        destroy
    }
}