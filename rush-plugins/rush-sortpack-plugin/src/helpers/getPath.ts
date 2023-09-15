import { fileURLToPath } from "url";

export const getDirname = (url: string) => fileURLToPath(new URL(".", url));

