import { join, dirname } from "path";
import { parse, type SemVer } from "semver";
import type TTypescript from "typescript";
import { JsonFile, type IPackageJson } from "@rushstack/node-core-library";
import { TypeScriptCore, type ExtendedTypeScript } from "./TypeScriptCore";

export interface ITypeScriptBuilderConfiguration {
  typeScriptToolPath: string;
  tsconfigPath: string;
  buildFolderPath: string;
}

export type ModuleFormat =
  | "commonjs"
  | "amd"
  | "umd"
  | "system"
  | "es2015"
  | "esnext";

export function getEmitModuleKind(
  ts: ExtendedTypeScript,
  format: ModuleFormat
): TTypescript.ModuleKind {
  switch (format.toLowerCase()) {
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
      throw new Error(`"${format}" is not a valid module kind name.`);
  }
}

export class TypeScriptBuilder {
  constructor(
    private readonly configuration: ITypeScriptBuilderConfiguration
  ) {}

  public async invokeAsync() {
    const ts: ExtendedTypeScript = require(this.configuration
      .typeScriptToolPath);

    const tsconfig: TTypescript.ParsedCommandLine = await this.readTsconfig(ts);

    const system: TTypescript.System = this.getSystem(ts);

    new TypeScriptCore({
      ts,
      tsconfig,
      system,
      libraries: [],
    });
  }

  private async getTypeScriptVersion(): Promise<SemVer> {
    const packageJsonPath = join(
      this.configuration.typeScriptToolPath,
      "package.json"
    );

    const packageJson: IPackageJson = await JsonFile.loadAsync(packageJsonPath);
    const parsedVersion: SemVer | null = parse(packageJson.version);

    if (!parsedVersion) {
      throw new Error(
        `Unable to parse version "${packageJson.version}" for TypeScript compiler package in: ${packageJsonPath}`
      );
    }

    return parsedVersion;
  }

  private async readTsconfig(
    ts: ExtendedTypeScript
  ): Promise<TTypescript.ParsedCommandLine> {
    const readResult: ReturnType<typeof ts.readConfigFile> = ts.readConfigFile(
      this.configuration.tsconfigPath,
      ts.sys.readFile
    );

    const basePath: string = dirname(this.configuration.tsconfigPath);

    const tsconfig: TTypescript.ParsedCommandLine =
      ts.parseJsonConfigFileContent(
        readResult.config,
        {
          fileExists: ts.sys.fileExists,
          readFile: ts.sys.readFile,
          readDirectory: ts.sys.readDirectory,
          useCaseSensitiveFileNames: true,
        },
        basePath,
        undefined,
        this.configuration.tsconfigPath
      );

    return tsconfig;
  }

  private getSystem(ts: ExtendedTypeScript): TTypescript.System {
    return {
      ...ts.sys,
      getCurrentDirectory: () => this.configuration.buildFolderPath,
    };
  }
}
