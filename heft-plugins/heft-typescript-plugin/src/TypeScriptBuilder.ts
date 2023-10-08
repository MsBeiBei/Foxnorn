import { resolve } from "path";
import type TTypescript from "typescript";
import { parse, type SemVer } from "semver";
import type { HeftLogger } from "@foxnorn/heft-lib";
import { JsonFile, type IPackageJson } from "@rushstack/node-core-library";
import type { ITypeScriptConfigurationFile } from "./HeftTypeScriptPlugin";

export interface ITypeScriptBuilderConfiguration
  extends ITypeScriptConfigurationFile {
  buildFolderPath: string;

  tempFolderPath: string;

  typeScriptToolPath: string;

  heftLogger: HeftLogger;
}

export class TypeScriptBuilder {
  private readonly _configuration: ITypeScriptBuilderConfiguration;
  private readonly _heftLogger: HeftLogger;

  private _typeScriptVersion!: string;
  private _typeScriptParsedVersion!: SemVer;

  public constructor(configuration: ITypeScriptBuilderConfiguration) {
    this._configuration = configuration;
    this._heftLogger = configuration.heftLogger;

    this._heftLogger.log(this._configuration);
  }

  public async invokeAsync() {
    const packageJsonFilename = resolve(
      this._configuration.typeScriptToolPath,
      "package.json"
    );

    // 异步加载package.json
    const packageJson: IPackageJson = await JsonFile.loadAsync(
      packageJsonFilename
    );
    this._typeScriptVersion = packageJson.version;
    const parsedVersion: SemVer | null = parse(this._typeScriptVersion);
    if (!parsedVersion) {
      throw new Error(
        `Unable to parse version "${this._typeScriptVersion}" for TypeScript compiler package in: ` +
          packageJsonFilename
      );
    }

    this._typeScriptParsedVersion = parsedVersion;

    const ts: typeof TTypescript = await import(
      this._configuration.typeScriptToolPath
    );

  }
}
