import { join, dirname } from "path";
import { parse, type SemVer } from "semver";
import type TTypescript from "typescript";
import type { IScopedLogger } from "@rushstack/heft";
import {
  JsonFile,
  type IPackageJson,
  type ITerminal,
} from "@rushstack/node-core-library";
import type { PerformanceMeasure } from "./types/performance";
import type { ExtendedTypeScript } from "./types/typescript";
import { getLibraryEmit } from "./helper/output";

export interface ITypeScriptBuilderConfiguration {
  typeScriptToolPath: string;
  tsconfigPath: string;
  buildFolderPath: string;
  scopedLogger: IScopedLogger;
}

export interface ITypeScriptTool {
  ts: ExtendedTypeScript;
  measureTsPerformance: PerformanceMeasure;
  system: TTypescript.System;
  diagnostics: TTypescript.Diagnostic[];
  reportDiagnostic: TTypescript.DiagnosticReporter;
}

export class TypeScriptBuilder {
  private readonly _configuration: ITypeScriptBuilderConfiguration;
  private readonly _typescriptTerminal: ITerminal;

  private _typescriptVersion!: string;
  private _typescriptParsedVersion!: SemVer;

  private _tool?: ITypeScriptTool;

  public constructor(configuration: ITypeScriptBuilderConfiguration) {
    this._configuration = configuration;
    this._typescriptTerminal = configuration.scopedLogger.terminal;
  }

  public async invokeAsync() {
    const packageJsonPath: string = join(
      this._configuration.typeScriptToolPath,
      "package.json"
    );
    const packageJson: IPackageJson = await JsonFile.loadAsync(packageJsonPath);
    this._typescriptVersion = packageJson.version;
    const parsedVersion: SemVer | null = parse(this._typescriptVersion);
    if (!parsedVersion) {
      throw new Error(
        `Unable to parse version "${this._typescriptVersion}" for TypeScript compiler package in: ${packageJsonPath}`
      );
    }

    this._typescriptParsedVersion = parsedVersion;

    const ts: ExtendedTypeScript = require(this._configuration
      .typeScriptToolPath);

    ts.performance.enable();

    const diagnostics: TTypescript.Diagnostic[] = [];

    const measureTsPerformance = <T extends object | void>(
      measureName: string,
      fn: () => T
    ): T & {
      duration: number;
      count: number;
    } => {
      const beforeName: string = `before${measureName}`;
      ts.performance.mark(beforeName);
      const result: T = fn();
      const afterName: string = `after${measureName}`;
      ts.performance.mark(afterName);
      ts.performance.measure(measureName, beforeName, afterName);

      return {
        ...result,
        duration: ts.performance.getDuration(measureName),
        count: ts.performance.getCount(beforeName),
      };
    };

    const system: TTypescript.System = {
      ...ts.sys,
      getCurrentDirectory: () => this._configuration.buildFolderPath,
    };

    this._tool = {
      ts,
      measureTsPerformance,
      system,
      diagnostics,
      reportDiagnostic: (diagnostic: TTypescript.Diagnostic) => {
        diagnostics.push(diagnostic);
      },
    };

    const { performance } = this._tool.ts;

    performance.disable();
    performance.enable();

    await this.compile(this._tool);
  }

  public async compile(tool: ITypeScriptTool) {
    const { ts, measureTsPerformance } = tool;

    const { duration, tsconfig, host } = measureTsPerformance(
      "Configure",
      () => {
        const tsconfig: TTypescript.ParsedCommandLine = this._readTsconfig(ts);

        const host: TTypescript.CompilerHost = ts.createCompilerHost(
          tsconfig.options
        );

        return {
          tsconfig,
          host,
        };
      }
    );

    this._typescriptTerminal.writeVerboseLine(`Configure: ${duration}ms`);

    const program: TTypescript.Program = ts.createProgram(
      tsconfig.fileNames,
      tsconfig.options,
      host,
      undefined,
      ts.getConfigFileParsingDiagnostics(tsconfig)
    );

    const emit = getLibraryEmit(ts, program, []);

    const emitResult: TTypescript.EmitResult = emit(
      undefined,
      ts.sys.writeFile,
      undefined,
      undefined,
      undefined
    );
  }

  private _readTsconfig(ts: ExtendedTypeScript): TTypescript.ParsedCommandLine {
    const readResult: ReturnType<typeof ts.readConfigFile> = ts.readConfigFile(
      this._configuration.tsconfigPath,
      ts.sys.readFile
    );

    const basePath: string = dirname(this._configuration.tsconfigPath);

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
        this._configuration.tsconfigPath
      );

    return tsconfig;
  }
}
