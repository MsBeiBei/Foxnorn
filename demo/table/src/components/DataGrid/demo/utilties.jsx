export const getMockData = (length) => {
    return Array.from({ length }).map((it, idx) => {
        return {
            name: `mock-data-${idx}`,
            id: idx
        }
    })
}
