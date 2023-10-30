import type { OutputOptions } from "./helper/outputs";

import { join, dirname } from "path";
import { Worker } from "worker_threads";
import { parse, type SemVer } from "semver";
import type { IScopedLogger } from "@rushstack/heft";
import {
  JsonFile,
  type IPackageJson,
  type ITerminal,
} from "@rushstack/node-core-library";
import type { PerformanceMeasure } from "./types/performance";
import type { ExtendedTypeScript, TTypescript } from "./types/typescript";
import type {
  TypeScriptWorkerData,
  TranspilationResponseMessage,
} from "./types/worker";
import { createEmit } from "./helper/emit";
import { getStandardOutputsOptions } from "./helper/outputs";
import type { TypeScriptConfigurationJson } from "./HeftTypeScriptPlugin";

export type SolutionBuilderWithWatchHost =
  TTypescript.SolutionBuilderWithWatchHost<TTypescript.EmitAndSemanticDiagnosticsBuilderProgram>;
export type SolutionBuilderHost =
  TTypescript.SolutionBuilderHost<TTypescript.EmitAndSemanticDiagnosticsBuilderProgram>;
export type WatchCompilerHost =
  TTypescript.WatchCompilerHostOfFilesAndCompilerOptions<TTypescript.EmitAndSemanticDiagnosticsBuilderProgram>;

export type CreateProgram =
  TTypescript.CreateProgram<TTypescript.EmitAndSemanticDiagnosticsBuilderProgram>;
export type WatchProgram =
  TTypescript.WatchOfFilesAndCompilerOptions<TTypescript.EmitAndSemanticDiagnosticsBuilderProgram>;

export interface TypeScriptBuilderConfiguration
  extends TypeScriptConfigurationJson {
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

export interface TypeScriptTool {
  ts: ExtendedTypeScript;
  system: TTypescript.System;
  diagnostics: TTypescript.Diagnostic[];
  createMeasuring: PerformanceMeasure;
  reportDiagnostic: TTypescript.DiagnosticReporter;
}

export class TypeScriptBuilder {
  private readonly _configuration: TypeScriptBuilderConfiguration;
  private readonly _scopedLogger: IScopedLogger;
  private readonly _terminal: ITerminal;

  private _typescriptVersion!: string;
  private _typescriptParsedVersion!: SemVer;

  private _tool?: TypeScriptTool;

  public constructor(configuration: TypeScriptBuilderConfiguration) {
    this._configuration = configuration;
    this._scopedLogger = configuration.scopedLogger;
    this._terminal = configuration.scopedLogger.terminal;
  }

  public async invokeAsync() {
    if (!this._tool) {
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

      const ts: ExtendedTypeScript = require(this._configuration
        .typeScriptToolPath);

      ts.performance.enable();

      const createMeasuring = <T extends object | void>(
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

      this._terminal.writeLine(`Using TypeScript version ${ts.version}`);

      const diagnostics: TTypescript.Diagnostic[] = [];

      const system: TTypescript.System = {
        ...ts.sys,
        getCurrentDirectory: () => this._configuration.buildFolderPath,
      };

      this._tool = {
        ts,
        createMeasuring,
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

    await this.compileAsync(this._tool);
  }

  public async compileAsync(tool: TypeScriptTool) {
    const { ts, createMeasuring } = tool;

    const {
      duration: configureDurationMs,
      tsconfig,
      host,
      outputs,
    } = createMeasuring("Configure", () => {
      const _tsconfig: TTypescript.ParsedCommandLine = this._readTsconfig(ts);

      const _host: TTypescript.CompilerHost = ts.createCompilerHost(
        tsconfig.options
      );

      const _outputs: RequiredProperties<OutputOptions, "module">[] =
        getStandardOutputsOptions(
          this._configuration.output,
          tsconfig,
          this._configuration.buildFolderPath
        );

      return {
        tsconfig: _tsconfig,
        host: _host,
        outputs: _outputs,
      };
    });

    this._terminal.writeVerboseLine(`Configure: ${configureDurationMs}ms`);

    const program: TTypescript.Program = ts.createProgram(
      tsconfig.fileNames,
      tsconfig.options,
      host,
      undefined,
      ts.getConfigFileParsingDiagnostics(tsconfig)
    );

    const { diagnostics: diagnosticsDurationMs } = createMeasuring(
      "Analyze",
      () => {
        const _diagnostics: TTypescript.Diagnostic[] = [
          ...program.getConfigFileParsingDiagnostics(),
          ...program.getOptionsDiagnostics(),
          ...program.getSyntacticDiagnostics(),
          ...program.getGlobalDiagnostics(),
          ...program.getSemanticDiagnostics(),
        ];

        return {
          diagnostics: _diagnostics,
        };
      }
    );

    this._terminal.writeVerboseLine(`Analyze: ${diagnosticsDurationMs}ms`);

    const emit = createEmit(ts, program, outputs);

    emit(undefined, ts.sys.writeFile, undefined, undefined, undefined);

    ts.performance.disable();
    ts.performance.enable();
  }

  public async compileWatchAsync() {}

  public async compileSolutionAsync() {}

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

  private _createProgram(ts: ExtendedTypeScript) {
    return (
      rootNames: readonly string[] | undefined,
      options: TTypescript.CompilerOptions | undefined,
      host?: TTypescript.CompilerHost,
      oldProgram?: TTypescript.EmitAndSemanticDiagnosticsBuilderProgram,
      configFileParsingDiagnostics?: readonly TTypescript.Diagnostic[],
      projectReferences?: readonly TTypescript.ProjectReference[] | undefined
    ): TTypescript.EmitAndSemanticDiagnosticsBuilderProgram => {
      const program: TTypescript.EmitAndSemanticDiagnosticsBuilderProgram =
        ts.createEmitAndSemanticDiagnosticsBuilderProgram(
          rootNames,
          options,
          host,
          oldProgram,
          configFileParsingDiagnostics,
          projectReferences
        );

      const isolatedModules: boolean =
        !!this._configuration.worker && !!options?.isolatedModules;

      if (isolatedModules) {
      }

      return program;
    };
  }

  private _createTranspileWorker() {
    const workerData: TypeScriptWorkerData = {
      typeScriptToolPath: this._configuration.typeScriptToolPath,
    };

    const worker = new Worker(require.resolve("./helper/worker.js"), {
      workerData,
    });

    worker.on("message", (response: TranspilationResponseMessage) => {
      const { requestId, type, result } = response;

      if (type === "failed") {
      } else {
        this._terminal.writeErrorLine(
          `Unexpected worker resolution for request with id ${requestId}`
        );
      }
    });

    worker.once("exit", () => {});

    worker.once("error", (error: Error) => {});
  }

  private _cleanTranspileWorker() {}
}
