const rootObserveOpts = { box: "border-box" };

export function useResizeEffect(model) {
    let root
    const mountedIndexes = new WeakMap()

    const getResizeObserver = () => {
        return new ResizeObserver((entries) => {
            for (const { target } of entries) {
                if (!(target).offsetParent) continue;

                if (target === root) {
                    model.updateViewport()
                } else {
                    model.draw()
                }
            }
        })
    }

    const observeRoot = (target) => {
        root = target

        const observer = getResizeObserver();
        observer.observe(root, rootObserveOpts);

        return () => {
            observer.disconnect();
            root = undefined
        }
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
        observeRoot,
        observeItem
    }
}