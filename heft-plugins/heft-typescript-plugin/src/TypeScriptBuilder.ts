import { resolve } from "path";
import { HeftLogger } from "@foxnorn/heft-lib";
import type { IScopedLogger } from "@rushstack/heft";
import { JsonFile, type IPackageJson } from "@rushstack/node-core-library";

export interface ITypeScriptBuilderConfiguration {
  /**
   * The scoped logger that the builder will log to.
   */
  scopedLogger: IScopedLogger;

  /**
   * The path to the TypeScript package.
   */
  typeScriptPackagePath: string;
}

export class TypeScriptBuilder {
  private readonly logger: HeftLogger;

  private readonly configuration: ITypeScriptBuilderConfiguration;

  public constructor(configuration: ITypeScriptBuilderConfiguration) {
    this.configuration = configuration;
    this.logger = new HeftLogger(configuration.scopedLogger);

    this.getTypeScriptVersion();
  }

  private async getTypeScriptVersion() {
    const compilerPackageJsonPath = resolve(
      this.configuration.typeScriptPackagePath,
      "package.json"
    );

    const packageJson: IPackageJson = await JsonFile.loadAsync(
      compilerPackageJsonPath
    );

    this.logger.log(2, packageJson);
  }
}
