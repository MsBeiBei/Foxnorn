import { resolve, dirname } from "path";
import { writeFileSync } from "fs";
import { parse, type SemVer } from "semver";
import type TTypescript from "typescript";
import type { IScopedLogger } from "@rushstack/heft";
import {
  JsonFile,
  //   type ITerminal,
  type IPackageJson,
} from "@rushstack/node-core-library";

export type ExtendedTypeScript = typeof TTypescript;

export interface ITypeScriptBuilderConfiguration {
  typeScriptToolPath: string;
  scopedLogger: IScopedLogger;
  tsconfigPath: string;
}

export interface ITypeScriptTool {
  ts: ExtendedTypeScript;
}

export class TypeScriptBuilder {
  private typescriptVersion!: string;
  private typescriptParsedVersion!: SemVer;

  private tool?: ITypeScriptTool;

  //   private get terminal(): ITerminal {
  //     return this.configuration.scopedLogger.terminal;
  //   }

  constructor(
    private readonly configuration: ITypeScriptBuilderConfiguration
  ) {}

  public async invokeAsync() {
    const compilerPackageJsonFilename: string = resolve(
      this.configuration.typeScriptToolPath,
      "package.json"
    );

    const packageJson: IPackageJson = await JsonFile.loadAsync(
      compilerPackageJsonFilename
    );
    this.typescriptVersion = packageJson.version;

    const parsedVersion: SemVer | null = parse(this.typescriptVersion);

    if (!parsedVersion) {
      throw new Error(
        `Unable to parse version "${this.typescriptVersion}" for TypeScript compiler package in: ` +
          compilerPackageJsonFilename
      );
    }
    this.typescriptParsedVersion = parsedVersion;

    const ts: ExtendedTypeScript = await import(
      this.configuration.typeScriptToolPath
    );

    this.tool = {
      ts,
    };

    await this.runBuildAsync(this.tool);
  }

  public async runBuildAsync(tool: ITypeScriptTool): Promise<void> {
    const { ts } = tool;

    const tsconfig: TTypescript.ParsedCommandLine = this.loadTsconfig(ts);
  }

  private loadTsconfig(ts: ExtendedTypeScript): TTypescript.ParsedCommandLine {
    const parsedConfigFile: ReturnType<typeof ts.readConfigFile> =
      ts.readConfigFile(this.configuration.tsconfigPath, ts.sys.readFile);

    const currentFolder: string = dirname(this.configuration.tsconfigPath);

    const tsconfig: TTypescript.ParsedCommandLine =
      ts.parseJsonConfigFileContent(
        parsedConfigFile.config,
        {
          fileExists: ts.sys.fileExists,
          readFile: ts.sys.readFile,
          readDirectory: ts.sys.readDirectory,
          useCaseSensitiveFileNames: true,
        },
        currentFolder,
        undefined,
        this.configuration.tsconfigPath
      );

    return tsconfig;
  }

  private validateTsconfig(
    ts: ExtendedTypeScript,
    tsconfig: TTypescript.ParsedCommandLine
  ): void {
    if (
        (tsconfig.options.module && !tsconfig.options.outDir) ||
        (!tsconfig.options.module && tsconfig.options.outDir)
      ) {
        throw new Error(
          'If either the module or the outDir option is provided in the tsconfig compilerOptions, both must be provided'
        );
      }

    if (!tsconfig.options.module) {
        throw new Error(
          'If the module tsconfig compilerOption is not provided, the builder must be provided with the ' +
            'additionalModuleKindsToEmit configuration option.'
        );
      }
  
  }

  private _parseModuleKind(ts: ExtendedTypeScript, moduleKindName: string): TTypescript.ModuleKind {
    switch (moduleKindName.toLowerCase()) {
      case 'commonjs':
        return ts.ModuleKind.CommonJS;

      case 'amd':
        return ts.ModuleKind.AMD;

      case 'umd':
        return ts.ModuleKind.UMD;

      case 'system':
        return ts.ModuleKind.System;

      case 'es2015':
        return ts.ModuleKind.ES2015;

      case 'esnext':
        return ts.ModuleKind.ESNext;

      default:
        throw new Error(`"${moduleKindName}" is not a valid module kind name.`);
    }
  }

  private buildIncrementalCompilerHost(){
    
  }
}
