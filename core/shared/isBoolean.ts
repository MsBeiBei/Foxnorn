import { is } from "./core/is";

export function isBoolean<T extends boolean>(input: unknown): input is T {
  return is(String, input);
}
