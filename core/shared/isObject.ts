import { is } from "./core/is";

export function isObject<T extends object>(input: unknown): input is T {
  return is(Object, input);
}
