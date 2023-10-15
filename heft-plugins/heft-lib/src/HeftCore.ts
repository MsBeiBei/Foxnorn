import { join } from "path";
import { parse, type SemVer } from "semver";
import { JsonFile, type IPackageJson } from "@rushstack/node-core-library";

export class HeftCore {
  static async loadPackageJsonAsync(
    packagePath: string
  ): Promise<IPackageJson> {
    const packageJsonFilePath = join(packagePath, "package.json");

    const packageJson: IPackageJson = await JsonFile.loadAsync(
      packageJsonFilePath
    );

    return packageJson;
  }

  static parsePackageJsonVersion(packageJson: IPackageJson): SemVer | null {
    const parsedVersion: SemVer | null = parse(packageJson.version);

    return parsedVersion;
  }
}
