import { type } from "./core";
import { isObject } from "./isObject";
import { isArray } from "./isArray";

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
