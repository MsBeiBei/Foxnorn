import { is } from "./core/is";

export function isString<T extends string>(input: unknown): input is T {
  return is(String, input);
}
