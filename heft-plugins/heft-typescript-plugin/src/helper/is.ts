export const isPlainObject = <T extends Record<string, any>>(
  val: unknown
): val is T => Object.prototype.toString.call(val) === "[object Object]";

export const isArray = <T extends any>(val: unknown): val is Array<T> =>
  Array.isArray(val);