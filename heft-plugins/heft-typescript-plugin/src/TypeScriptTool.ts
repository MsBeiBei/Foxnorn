import { dirname } from "path";
import { Worker } from "worker_threads";
import type { ITerminal } from "@rushstack/node-core-library";
import type { ExtendedTypeScript, TTypescript } from "./types/typescript";
import { getSourceFileFromBuilderProgram } from "./helper/file";

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

export interface TypeScriptToolConfiguration {
  ts: ExtendedTypeScript;
  terminal: ITerminal;
  system: TTypescript.System;
  diagnostics: TTypescript.Diagnostic[];
  reportDiagnostic: TTypescript.DiagnosticReporter;
}

export class TypeScriptTool {
  private readonly _configuration: TypeScriptToolConfiguration;

  public constructor(configuration: TypeScriptToolConfiguration) {
    this._configuration = configuration;
  }

  public async compileAsync() {
    const { duration } = this._measurePerformance("Configure", () => {
      const tsconfig: TTypescript.ParsedCommandLine = this._readTsconfig(
        this._project
      );

      return {
        tsconfig,
      };
    });

    this._terminal.writeVerboseLine(`Configure: ${duration}ms`);

    this._ts.performance.disable();
    this._ts.performance.enable();
  }

  public async compileWatchAsync(reference?: boolean, worker?: boolean) {
    const { duration, tsconfig } = this._measurePerformance("Configure", () => {
      const tsconfig: TTypescript.ParsedCommandLine = this._readTsconfig(
        this._project
      );

      return {
        tsconfig,
      };
    });

    this._terminal.writeVerboseLine(`Configure: ${duration}ms`);

    if (reference) {
      const host: SolutionBuilderWithWatchHost =
        this._createSolutionBuilderWithWatchHost();

      const builder: TTypescript.SolutionBuilder<TTypescript.EmitAndSemanticDiagnosticsBuilderProgram> =
        this._ts.createSolutionBuilderWithWatch(host, [this._project], {});

      builder.build();
    } else {
      const host: WatchCompilerHost = this._createWatchCompilerHost(tsconfig);
      const program: WatchProgram = this._ts.createWatchProgram(host);
    }
  }

  public async compileSolutionAsync() {
    this._terminal.writeVerboseLine(`Using solution mode`);
  }

  private _createCompilerHost(): TTypescript.CompilerHost {
    const host: TTypescript.CompilerHost = this._ts.createCompilerHost(
      this._tsconfig.options
    );

    return host;
  }

  private _createWatchCompilerHost(
    tsconfig: TTypescript.ParsedCommandLine,
    system?: TTypescript.System
  ): WatchCompilerHost {
    const host: WatchCompilerHost = this._ts.createWatchCompilerHost(
      tsconfig.fileNames,
      tsconfig.options,
      system ?? this._ts.sys,
      this._createProgram(),
      this._reportDiagnostic,
      () => {},
      tsconfig.projectReferences,
      tsconfig.watchOptions
    );

    return host;
  }

  private _createIncrementalCompilerHost(
    system?: TTypescript.System
  ): TTypescript.CompilerHost {
    const host: TTypescript.CompilerHost =
      this._ts.createIncrementalCompilerHost(
        this._tsconfig.options,
        system ?? this._ts.sys
      );

    return host;
  }

  private _createSolutionBuilderWithWatchHost(
    system?: TTypescript.System
  ): SolutionBuilderWithWatchHost {
    const host: SolutionBuilderWithWatchHost =
      this._ts.createSolutionBuilderWithWatchHost(
        system ?? this._ts.sys,
        this._createProgram(),
        this._reportDiagnostic,
        this._reportDiagnostic,
        this._reportDiagnostic
      );

    return host;
  }

  private _createSolutionBuilderHost(
    system?: TTypescript.System
  ): SolutionBuilderHost {
    const reportErrorSummary = (
      _errorCount: number,
      _filesInError: (TTypescript.ReportFileInError | undefined)[]
    ): void => {};

    const buildHost: SolutionBuilderHost = this._ts.createSolutionBuilderHost(
      system ?? this._ts.sys,
      this._createProgram(),
      this._reportDiagnostic,
      this._reportDiagnostic,
      reportErrorSummary
    );

    return buildHost;
  }

  private _createProgram(worker?: boolean): CreateProgram {
    return (
      rootNames: readonly string[] | undefined,
      options: TTypescript.CompilerOptions | undefined,
      host?: TTypescript.CompilerHost,
      oldProgram?: TTypescript.EmitAndSemanticDiagnosticsBuilderProgram,
      configFileParsingDiagnostics?: readonly TTypescript.Diagnostic[],
      projectReferences?: readonly TTypescript.ProjectReference[] | undefined
    ): TTypescript.EmitAndSemanticDiagnosticsBuilderProgram => {
      this._ts.performance.disable();
      this._ts.performance.enable();

      this._terminal.writeVerboseLine(
        `Reading program "${options!["configFilePath"]}"`
      );

      const program: TTypescript.EmitAndSemanticDiagnosticsBuilderProgram =
        this._ts.createEmitAndSemanticDiagnosticsBuilderProgram(
          rootNames,
          options,
          host,
          oldProgram,
          configFileParsingDiagnostics,
          projectReferences
        );

      program.getSourceFiles();

      const isolatedModules: boolean = !!worker && !!options?.isolatedModules;

      if (isolatedModules) {
        const sourceFiles: Map<string, string> =
          getSourceFileFromBuilderProgram(program);
      }

      return program;
    };
  }

  private _createEmit<T extends TTypescript.BuilderProgram>(
    program: TTypescript.Program
  ) {}

  private _reportDiagnostic(diagnostic: TTypescript.Diagnostic): void {
    this._diagnostics.push(diagnostic);
  }

  private _readTsconfig(ts:ExtendedTypeScript): TTypescript.ParsedCommandLine {
    const readResult: ReturnType<typeof ts.readConfigFile> =
    ts.readConfigFile(fileName, ts.sys.readFile);

    const basePath: string = dirname(fileName);

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
        fileName
      );

    return tsconfig;
  }

  private _measurePerformance = <T extends object | void>(
    measureName: string,
    fn: () => T
  ): T & {
    duration: number;
    count: number;
  } => {
    const beforeName: string = `before${measureName}`;
    this._ts.performance.mark(beforeName);
    const result: T = fn();
    const afterName: string = `after${measureName}`;
    this._ts.performance.mark(afterName);
    this._ts.performance.measure(measureName, beforeName, afterName);

    return {
      ...result,
      duration: this._ts.performance.getDuration(measureName),
      count: this._ts.performance.getCount(beforeName),
    };
  };

  private _createTranspileWorker() {
    const workerData: TypeScriptWorkerData = {
      typeScriptToolPath: "",
    };

    const worker = new Worker(require.resolve("./worker.js"), { workerData });

    worker.on("message", () => {});

    worker.once("exit", () => {});

    worker.once("error", (error: Error) => {});

    return worker;
  }
}
