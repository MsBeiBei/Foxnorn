const rootObserveOpts = { box: "border-box" };

export function useResizeEffect(model) {
    let rootElement

    const mountedIndexes = new WeakMap()

    const getResizeObserver = () => {
        return new ResizeObserver((entries) => {
            for (const { target } of entries) {
                if (!(target).offsetParent) continue;

                if (target === rootElement) {
                    model.viewport = { clientWidth: target.clientWidth, clientHeight: target.clientHeight }
                } else {
                    const cell = mountedIndexes.get(target);

                    if (cell) {
                        const [ridx, cidx] = cell;
                        const { width, height } = target.getBoundingClientRect();
                        model.cell = { ridx, cidx, width, height }
                    }
                }
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

    const observeRoot = (target) => {
        rootElement = target;
        const observer = getResizeObserver();
        observer.observe(target, rootObserveOpts);

        return () => {
            observer.disconnect();
            rootElement = undefined
        }
    }

    return {
        observeRoot,
        observeItem
    }
}