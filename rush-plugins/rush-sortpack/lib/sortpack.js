import { resolve } from "path";
import { FileSystem } from "@rushstack/node-core-library";
import sort from "sort-package-json";
export function sortpack(path) {
    const packageJsonFilePath = resolve(path, "package.json");
    if (!FileSystem.exists(packageJsonFilePath)) {
        throw new Error(`package.json for ${packageJsonFilePath} does not exist`);
    }
    const input = FileSystem.readFile(packageJsonFilePath);
    FileSystem.writeFile(packageJsonFilePath, sort(input));
}
//# sourceMappingURL=sortpack.js.map