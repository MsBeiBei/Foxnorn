import type TTypescript from "typescript";

export type ExtendedTypeScript = typeof TTypescript & {
  performance: {
    mark(name: string): void;
    measure(name: string, startMark?: string, endMark?: string): void;
    disable(): void;
    enable(): void;
    getDuration(name: string): number;
    getCount(name: string): number;
  };
};

export class TypeScriptCore {
  private _diagnostics: TTypescript.Diagnostic[] = [];

  constructor(
    private readonly ts: ExtendedTypeScript,
    private readonly tsconfig: TTypescript.ParsedCommandLine,
    private readonly system: TTypescript.System
  ) {}

  private _createSolutionBuilderWithWatchHost() {
    const { _reportDiagnostic, ts, system } = this;

    const host: TTypescript.SolutionBuilderWithWatchHost<TTypescript.EmitAndSemanticDiagnosticsBuilderProgram> =
      this.ts.createSolutionBuilderWithWatchHost(
        system,
        this._createProgram(),
        this._reportDiagnostic,
        this._reportDiagnostic,
        this._reportDiagnostic
      );

    return host;
  }
  private _createSolutionBuilderHost() {
    this.ts.createSolutionBuilderHost;
  }

  private _createProgram(): TTypescript.CreateProgram<TTypescript.EmitAndSemanticDiagnosticsBuilderProgram> {
    return (
      rootNames: readonly string[] | undefined,
      options: TTypescript.CompilerOptions | undefined,
      host?: TTypescript.CompilerHost,
      oldProgram?: TTypescript.EmitAndSemanticDiagnosticsBuilderProgram,
      configFileParsingDiagnostics?: readonly TTypescript.Diagnostic[],
      projectReferences?: readonly TTypescript.ProjectReference[] | undefined
    ) => {
      const program: TTypescript.EmitAndSemanticDiagnosticsBuilderProgram =
        this.ts.createEmitAndSemanticDiagnosticsBuilderProgram(
          rootNames,
          options,
          host,
          oldProgram,
          configFileParsingDiagnostics,
          projectReferences
        );

      return program;
    };
  }

  private _reportDiagnostic(diagnostic: TTypescript.Diagnostic): void {
    this._diagnostics.push(diagnostic);
  }
}
