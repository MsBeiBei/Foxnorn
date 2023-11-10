export const once = (fn) => {
    let called;
    let cache;

    return ((...args) => {
        if (!called) {
            called = true;
            cache = fn(...args);
        }
        return cache;
    });
};
