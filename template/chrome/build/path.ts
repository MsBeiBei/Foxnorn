import path from "path";
import { dirname } from "./constants";

export function resolve(dir: string) {
  return path.resolve(dirname, "..", dir);
}
