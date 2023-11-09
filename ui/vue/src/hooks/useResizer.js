export function useResizer(target, callback) {
    let observer = new ResizeObserver((entries) => {
        callback(entries)
    })

    observer.observe(target)

    const cleanup = () => {
        if (observer) {
            observer.disconnect()
            observer = undefined
        }
    }

    const stop = () => {
        cleanup()
    }

    return [observer, stop]
}