import { is } from "./core/is";

export function isArray<T extends any[]>(input: unknown): input is T {
  return is(Array, input);
}
