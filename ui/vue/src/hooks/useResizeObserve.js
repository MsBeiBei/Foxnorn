export function useResizeObserve(target, callback) {
    let observer = new ResizeObserver((_target) => {
        callback(_target)
    })

    observer.observe(target)

    const disconnect = () => {
        observer.unobserve(target)
        observer.disconnect()
        observer = null
    }

    return [observer, disconnect]
}