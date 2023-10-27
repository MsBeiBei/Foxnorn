export const isString = <T extends string>(val: unknown): val is T =>
  typeof val === "string";

export const isBoolean = <T extends boolean>(val: unknown): val is T =>
  typeof val === "boolean";

export const isNumber = <T extends number>(val: unknown): val is T =>
  typeof val === "number";

export const isPlainObject = <T extends Record<string, any>>(
  val: unknown
): val is T => Object.prototype.toString.call(val) === "[object Object]";

export const isObject = <T extends Record<string, any>>(
  val: unknown
): val is T => typeof val === "object" && val !== null;

export const isFunction = <T extends Function>(val: unknown): val is T =>
  typeof val === "function";

export const isArray = <T extends Array<any>>(val: unknown): val is T =>
  Array.isArray(val);
