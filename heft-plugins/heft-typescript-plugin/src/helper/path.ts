export function isTsConfigFile(path: string): boolean {
  return path.includes("tsconfig") && path.includes("json");
}