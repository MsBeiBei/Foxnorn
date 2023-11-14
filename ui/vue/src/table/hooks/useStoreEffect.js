import { Store } from '../model/store'

export function useStoreEffect(options) {
    const { count, size, isVirtual } = options ?? {}

    const store = new Store(count, size, isVirtual)

    const getStartIndex = () => {
        let startIndex = 0;
        let offsetSize = 0;

        while (offsetSize < 30) {
            const size = store._indices[startIndex];
            startIndex += 1
            offsetSize += size !== undefined ? size : store._defaultSize;
        }

        return Math.max(0, startIndex - 1);
    }

    const getComputeRange = () => {
        if (!isVirtual) {
            return { startIndex: 0, endIndex: Infinity };
        }

        const startIndex = getStartIndex();
        return { startIndex }
    }

    const getVirtualSize = () => {

    }

    const getViewportSize = () => {

    }

    return {
        store,

        getComputeRange,
        getVirtualSize,
        getViewportSize
    }
}