export function is(ctor, input) {
    if (arguments.length === 1) return (_input) => is(ctor, _input);

    return (input != null && input.constructor === ctor) || input instanceof ctor;
}

export function isFunction(input) {
    return is(Function, input);
}