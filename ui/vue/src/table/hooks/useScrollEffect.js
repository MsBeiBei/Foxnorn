import { IS_SAFARI } from '../utilties/constants'

export function useScrollEffect() {
    let root

    const onScroll = (event) => {
        event.stopPropagation()
    }

    const onMousedown = () => {

    }

    const onMousewheel = (event) => {
        if (!IS_SAFARI) {
            return;
        }

        onScroll(event)
    }

    const register = () => {
        root.addEventListener("mousedown", onMousedown)
        root.addEventListener("scroll", onScroll, { passive: true, })
        root.addEventListener("mousewheel", onMousewheel)

        return () => {
            root.removeEventListener("mousedown", onMousedown)
            root.removeEventListener("scroll", onScroll)
            root.removeEventListener("scroll", onMousewheel)
        }
    }

    const observe = (target) => {
        root = target

        const stop = register()

        return stop
    }

    return {
        observe
    }
}