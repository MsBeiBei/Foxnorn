import { getDirname } from "./helpers/getPath.js";

export const dirname = getDirname(import.meta.url);

export const CWD = process.cwd();
