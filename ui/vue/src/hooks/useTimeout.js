
export function useTimeout(callback) {
    let timeoutID

    const clearTimeout = () => {
        if (timeoutID) {
            window.clearTimeout(timeoutID)
            timeoutID = undefined
        }
    }

    timeoutID = window.setTimeout(() => {
        callback()
        clearTimeout()
    })



    return [timeoutID, clearTimeout]
}