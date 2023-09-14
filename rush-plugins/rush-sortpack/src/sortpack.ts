import { resolve } from "path";
import { FileSystem } from "@rushstack/node-core-library";
import sort from "sort-package-json";

export function sortpack(path: string): void {
  const packageJsonFilePath: string = resolve(path, "package.json");
  if (!FileSystem.exists(packageJsonFilePath)) {
    throw new Error(`package.json for ${packageJsonFilePath} does not exist`);
  }
  const input: string = FileSystem.readFile(packageJsonFilePath);
  FileSystem.writeFile(packageJsonFilePath, sort(input));
}
