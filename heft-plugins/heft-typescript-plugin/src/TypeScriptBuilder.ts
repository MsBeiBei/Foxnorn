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
import { getEmitForOutput } from "./helper/emit";
import { getOutputsForEmit } from "./helper/outputs";
import type { ITypeScriptConfigurationJson } from "./HeftTypeScriptPlugin";

export interface ITypeScriptBuilderConfiguration
  extends ITypeScriptConfigurationJson {
  /**
   * Project build folder path. This is the folder containing the project's package.json file.
   */
  buildFolderPath: string;

  /**
   * The path to the TypeScript tool.
   */
  typeScriptToolPath: string;

  /**
   * The path to the tsconfig.json file of the project being built.
   */
  tsconfigPath: string;

  /**
   * A logger which is used to emit errors and warnings to the console, as well as to write
   * to the console.
   */
  scopedLogger: IScopedLogger;
}

export interface ICompilerCapabilities {
  /**
   * Support for incremental compilation via `ts.createIncrementalProgram()`.
   * Introduced with TypeScript 3.6.
   */
  incrementalProgram: boolean;

  /**
   * Support for composite projects via `ts.createSolutionBuilder()`.
   * Introduced with TypeScript 3.0.
   */
  solutionBuilder: boolean;
}

export interface ITypeScriptTool {
  ts: ExtendedTypeScript;
  system: TTypescript.System;
  diagnostics: TTypescript.Diagnostic[];
  measureTsPerformance: PerformanceMeasure;
  reportDiagnostic: TTypescript.DiagnosticReporter;
}

export class TypeScriptBuilder {
  private readonly _configuration: ITypeScriptBuilderConfiguration;
  private readonly _typescriptLogger: IScopedLogger;
  private readonly _typescriptTerminal: ITerminal;

  private _typescriptVersion!: string;
  private _typescriptParsedVersion!: SemVer;

  private _capabilities!: ICompilerCapabilities;

  private _tool?: ITypeScriptTool;

  public constructor(configuration: ITypeScriptBuilderConfiguration) {
    this._configuration = configuration;
    this._typescriptLogger = configuration.scopedLogger;
    this._typescriptTerminal = configuration.scopedLogger.terminal;
  }

  public async invokeAsync() {
    if (!this._tool) {
      // Determine the compiler version
      const packageJsonPath: string = join(
        this._configuration.typeScriptToolPath,
        "package.json"
      );
      const packageJson: IPackageJson = await JsonFile.loadAsync(
        packageJsonPath
      );
      this._typescriptVersion = packageJson.version;
      const parsedVersion: SemVer | null = parse(this._typescriptVersion);
      if (!parsedVersion) {
        throw new Error(
          `Unable to parse version "${this._typescriptVersion}" for TypeScript compiler package in: ${packageJsonPath}`
        );
      }
      this._typescriptParsedVersion = parsedVersion;

      this._capabilities = {
        incrementalProgram: false,
        solutionBuilder: this._typescriptParsedVersion.major >= 3,
      };

      if (
        this._typescriptParsedVersion.major > 3 ||
        (this._typescriptParsedVersion.major === 3 &&
          this._typescriptParsedVersion.minor >= 6)
      ) {
        this._capabilities.incrementalProgram = true;
      }

      const ts: ExtendedTypeScript = require(this._configuration
        .typeScriptToolPath);

      ts.performance.enable();

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

      this._typescriptTerminal.writeLine(
        `Using TypeScript version ${ts.version}`
      );

      const diagnostics: TTypescript.Diagnostic[] = [];

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
    }

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

    const outputs = getOutputsForEmit(
      this._configuration.output,
      tsconfig,
      this._configuration.buildFolderPath
    );

    const emit = getEmitForOutput(ts, program, outputs);

    emit(undefined, ts.sys.writeFile, undefined, undefined, undefined);
  }

  public async compileIncremental() {}

  public async compileWatch() {}

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

  private _queueTranspileInWorker() {}

  private _createProgram() {
    return (
      rootNames: readonly string[] | undefined,
      options: TTypescript.CompilerOptions | undefined,
      host?: TTypescript.CompilerHost,
      oldProgram?: TTypescript.EmitAndSemanticDiagnosticsBuilderProgram,
      configFileParsingDiagnostics?: readonly TTypescript.Diagnostic[],
      projectReferences?: readonly TTypescript.ProjectReference[]
    ) => {};
  }
}
