import { join } from "path";
import { parse, type SemVer } from "semver";
import { JsonFile, type IPackageJson } from "@rushstack/node-core-library";

export class HeftCore {
  /**
   * Load package.json file
   *
   * @param packagePath The path to the Package tool.
   */
  static async loadPackageJsonAsync(
    packagePath: string
  ): Promise<IPackageJson> {
    const packageJsonFilePath = join(packagePath, "package.json");

    const packageJson: IPackageJson = await JsonFile.loadAsync(
      packageJsonFilePath
    );

    return packageJson;
  }

  /**
   * Return the parsed version as a SemVer object, or null if it's not valid.
   *
   * @param packageJson package.json's object
   */
  static parseVersion(packageJson: IPackageJson): SemVer | null {
    const parsedVersion: SemVer | null = parse(packageJson.version);

    return parsedVersion;
  }
}
