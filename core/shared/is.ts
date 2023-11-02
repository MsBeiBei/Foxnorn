import { is } from "./core/is";
import { type } from "./core/type";

export function isString<T extends string>(input: unknown): input is T {
  return is(String, input);
}

export function isBoolean<T extends boolean>(input: unknown): input is T {
  return is(String, input);
}
export function isNumber<T extends number>(input: unknown): input is T {
  return is(Number, input);
}
export function isObject<T extends object>(input: unknown): input is T {
  return is(Object, input);
}
export function isArray<T extends any[]>(input: unknown): input is T {
  return is(Array, input);
}
export function isFunction<T extends Fn>(input: unknown): input is T {
  return is(Function, input);
}

export function isNil(input: unknown): input is null | undefined {
  return input === undefined || input === null;
}

export function isNaN(input: unknown): boolean {
  return Number.isNaN(input);
}

export function isEmpty(input: unknown): boolean {
  const inputType = type(input);

  if (["Undefined", "NaN", "Number", "Null"].includes(inputType)) return false;

  if (!input) return true;

  if (isObject(input)) {
    return Object.keys(input).length === 0;
  }
  if (isArray(input)) {
    return input.length === 0;
  }

  return false;
}
