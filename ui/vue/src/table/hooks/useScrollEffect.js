import { IS_SAFARI, ACTION_SCROLL } from '../utilties/constants'

export function useScrollEffect(model) {
    let root

    const onScroll = (event) => {
        event.stopPropagation();
        model._ws.update(ACTION_SCROLL, event.target.scrollLeft)
        model._hs.update(ACTION_SCROLL, event.target.scrollTop)
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