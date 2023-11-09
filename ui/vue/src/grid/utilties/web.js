export const isBrowser = typeof window !== "undefined";

export const computeStyle = (e) => window.getComputedStyle(e);

export const toPx = (px) => parseFloat(px) + 'px'

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

export const getDocumentRoot = () => document.documentElement;

export const isRTLDocument = once(() => {
    return isBrowser
        ? computeStyle(getDocumentRoot()).direction === "rtl"
        : false;
});
