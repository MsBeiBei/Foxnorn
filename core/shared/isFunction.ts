import { is } from "./core/is";

export function isFunction<T extends Fn>(input: unknown): input is T {
  return is(Function, input);
}
