import { resolve } from "path";
import { parse, type SemVer } from "semver";
import { HeftLogger } from "@foxnorn/heft-lib";
import type { IScopedLogger } from "@rushstack/heft";
import { JsonFile, type IPackageJson } from "@rushstack/node-core-library";
import { type ExtendedTypeScript } from "./types";

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

    this.getTypeScriptCompiler();
  }

  public async getTypeScriptVersion(): Promise<SemVer> {
    const compilerPackageJsonPath = resolve(
      this.configuration.typeScriptPackagePath,
      "package.json"
    );

    const packageJson: IPackageJson = JsonFile.load(compilerPackageJsonPath);

    const typescriptVersion = packageJson.version;

    const parsedVersion: SemVer | null = parse(typescriptVersion);

    if (!parsedVersion) {
      throw new Error(
        `Unable to parse version "${typescriptVersion}" for TypeScript compiler package in: ` +
          compilerPackageJsonPath
      );
    }

    return parsedVersion;
  }

  private async getTypeScriptCompiler() {
    const ts: ExtendedTypeScript = await import(
      this.configuration.typeScriptPackagePath
    );

    this.logger.log(`Using TypeScript version ${ts.version}`);
  }

  private async getTypeScriptModuleKind(
    ts: ExtendedTypeScript,
    moduleKindName: string
  ) {
    switch (moduleKindName.toLowerCase()) {
      case "commonjs":
        return ts.ModuleKind.CommonJS;

      case "amd":
        return ts.ModuleKind.AMD;

      case "umd":
        return ts.ModuleKind.UMD;

      case "system":
        return ts.ModuleKind.System;

      case "es2015":
        return ts.ModuleKind.ES2015;

      case "esnext":
        return ts.ModuleKind.ESNext;

      default:
        throw new Error(`"${moduleKindName}" is not a valid module kind name.`);
    }
  }
}
