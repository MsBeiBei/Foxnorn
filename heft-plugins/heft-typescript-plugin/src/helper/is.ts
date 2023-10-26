export const isPlainObject = <T extends object>(val: unknown): val is T =>
  Object.prototype.toString.call(val) === "[object Object]";

export const isArray = <T extends any[]>(val: unknown): val is T =>
  Array.isArray(val);
