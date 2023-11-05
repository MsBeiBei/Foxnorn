import { is } from "./core/is";

export function isNumber<T extends number>(input: unknown): input is T {
  return is(Number, input);
}
