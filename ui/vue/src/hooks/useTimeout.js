
export function useTimeout(callback) {
    let timeoutID

    const clearTimeout = () => {
        if (timeoutID) {
            window.clearTimeout(timeoutID)
            timeoutID = null
        }
    }

    timeoutID = window.setTimeout(() => {
        callback()
        clearTimeout()
    })



    return [timeoutID, clearTimeout]
}