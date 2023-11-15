import { Store } from '../model/store'

export function useStoreEffect(options = {}) {
    const { count, size, virtual = true } = options

    const store = new Store(count, size)

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
        if (!virtual) {
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
        getComputeRange,
        getVirtualSize,
        getViewportSize
    }
}