import type TTypescript from "typescript";
import type { ITerminal } from "@rushstack/node-core-library";
import type { OutputOptions } from "./helper/outputs";
import { getStandardOutputsOptions } from "./helper/outputs";

export { TTypescript };

export type ExtendedTypeScript = typeof TTypescript & {
  performance: {
    mark(name: string): void;
    measure(name: string, startMark?: string, endMark?: string): void;
    disable(): void;
    enable(): void;
    getDuration(name: string): number;
    getCount(name: string): number;
  };
  combinePaths(path: string, ...paths: (string | undefined)[]): string;
};

export interface TypeScriptCoreOptions {
  ts: ExtendedTypeScript;
  project: string;
  terminal: ITerminal;
  system: TTypescript.System;
  reference?: boolean;
  worker?: boolean;
  outputs?: OutputOptions | OutputOptions[];
}

export interface ReadResult {
  config?: any;
  error?: TTypescript.Diagnostic;
}

export class TypeScriptCore {
  private readonly _options: TypeScriptCoreOptions;

  public constructor(options: TypeScriptCoreOptions) {
    this._options = options;
  }

  public async execute() {
    const { outputs, project, terminal } = this._options;

    const { duration } = this._createMeasuring("Configure", () => {
      const _tsconfig: TTypescript.ParsedCommandLine = this._readTsconfig();

      const _outputs: RequiredProperties<OutputOptions, "module">[] =
        getStandardOutputsOptions(outputs, _tsconfig, project);

      return {
        tsconfig: _tsconfig,
        outputs: _outputs,
      };
    });

    terminal.writeVerboseLine(`Configure: ${duration}ms`);
  }

  public async compile() {}

  private _createWatchCompilerHost(tsconfig: TTypescript.ParsedCommandLine) {
    const { ts, system } = this._options;

    const host = ts.createWatchCompilerHost(
      tsconfig.fileNames,
      tsconfig.options,
      system,
      this._createEmitAndSemanticDiagnosticsBuilderProgram(),
      undefined,
      undefined,
      tsconfig.projectReferences,
      tsconfig.watchOptions
    );

    return host;
  }

  private _createSolutionBuilderHost(){
    
  }

  private _createSolutionBuilderWithWatchHost() {
    const { ts, system } = this._options;

    const host = ts.createSolutionBuilderWithWatchHost(
      system,
      this._createEmitAndSemanticDiagnosticsBuilderProgram()
    );

    return host;
  }

  private _createEmitAndSemanticDiagnosticsBuilderProgram(): TTypescript.CreateProgram<TTypescript.EmitAndSemanticDiagnosticsBuilderProgram> {
    const { ts, terminal } = this._options;

    return (
      rootNames: readonly string[] | undefined,
      options: TTypescript.CompilerOptions | undefined,
      host?: TTypescript.CompilerHost,
      oldProgram?: TTypescript.EmitAndSemanticDiagnosticsBuilderProgram,
      configFileParsingDiagnostics?: readonly TTypescript.Diagnostic[],
      projectReferences?: readonly TTypescript.ProjectReference[]
    ): TTypescript.EmitAndSemanticDiagnosticsBuilderProgram => {
      ts.performance.disable();
      ts.performance.enable();

      terminal.writeVerboseLine(
        `Reading program "${options!["configFilePath"]}"`
      );

      const builderProgram: TTypescript.EmitAndSemanticDiagnosticsBuilderProgram =
        ts.createEmitAndSemanticDiagnosticsBuilderProgram(
          rootNames,
          options,
          host,
          oldProgram,
          configFileParsingDiagnostics,
          projectReferences
        );

      const program = builderProgram.getProgram();

      return builderProgram;
    };
  }

  private _createMeasuring<T extends object | void>(
    measureName: string,
    fn: () => T
  ): T & {
    duration: number;
    count: number;
  } {
    const { ts } = this._options;

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
  }

  private _readTsconfig(): TTypescript.ParsedCommandLine {
    const { project, ts } = this._options;

    const tsconfigPath = ts.combinePaths(project, "tsconfig.json");

    const readResult: ReadResult = ts.readConfigFile(
      tsconfigPath,
      ts.sys.readFile
    );

    const tsconfig: TTypescript.ParsedCommandLine =
      ts.parseJsonConfigFileContent(
        readResult.config,
        {
          fileExists: ts.sys.fileExists,
          readFile: ts.sys.readFile,
          readDirectory: ts.sys.readDirectory,
          useCaseSensitiveFileNames: true,
        },
        project,
        undefined,
        tsconfigPath
      );

    return tsconfig;
  }
}
