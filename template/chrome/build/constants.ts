import path from "path";
import { fileURLToPath } from "url";
import { resolve } from "./path";

export const filename = fileURLToPath(import.meta.url);
export const dirname = path.dirname(filename);
export const CWD = process.cwd();
export const SRC_DIR = resolve("src");
export const PUBLIC_DIR = resolve("public");
export const OUT_DIR = resolve("dist");

export const ESLINT_EXTENSIONS = [
  ".vue",
  ".tsx",
  ".ts",
  ".jsx",
  ".js",
  ".mjs",
  ".cjs",
];

export const CONTENT_PATH = resolve("src/content/index.ts");
export const POPUP_PATH = resolve("src/popup/index.html");
