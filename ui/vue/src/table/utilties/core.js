export const min = Math.min;

export const max = Math.max;

export const abs = Math.abs;

export const ceil = Math.ceil;

export const now = Date.now;

export const timeout = setTimeout;

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

export const clamp = (
    value,
    minValue,
    maxValue
) => min(maxValue, max(minValue, value));

export const exists = (v) => v != null;


export const debounce = (fn, delay) => {
    let timer = null;

    return function () {
        let context = this;

        let args = arguments;

        clearTimeout(timer);

        timer = setTimeout(function () {
            fn.apply(context, args);
        }, delay);
    };
};
