const rootObserveOpts = { box: "border-box" };

export function useResizeEffect() {
    let root = undefined
    const cells = new WeakMap()

    const getResizeObserver = () => {

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
        cells.set(target, [ridx, cidx])
        observer.observe(target);

        return () => {
            cells.delete(target);
            observer.unobserve(target);
        }
    }

    return {
        observeRoot,
        observeItem
    }
}