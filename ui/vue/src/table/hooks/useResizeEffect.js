
export function useResizeEffect() {
    const mountedIndexes = new WeakMap()

    const getResizeObserver = () => {
        return new ResizeObserver((entries) => {
            for (const { target } of entries) {
                if (!(target).offsetParent) continue;
            }
        })
    }


    const observeItem = (target, ridx, cidx) => {
        const observer = getResizeObserver();
        mountedIndexes.set(target, [ridx, cidx])
        observer.observe(target);

        return () => {
            mountedIndexes.delete(target);
            observer.unobserve(target);
        }
    }

    return {
        observeItem
    }
}