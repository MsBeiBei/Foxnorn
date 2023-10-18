import type TTypeScript from "typescript";

export interface IExtendTypeScript {
  performance: {
    mark(measureName: string): void;
    measure(measureName: string, startMark?: string, endMark?: string): void;
    getDuration(measureName: string): number;
    getCount(measureName: string): number;
    enable(): void;
    disable(): void;
  };
}

export type ExtendedTypeScript = typeof TTypeScript & IExtendTypeScript;

export interface IEmitModuleKind {
  moduleKind: TTypeScript.ModuleKind;
  outFolderPath: string;
  extension?: string;
}

export class TypeScriptCore {
  private readonly diagnostics: TTypeScript.Diagnostic[] = [];

  constructor(
    private readonly ts: ExtendedTypeScript,
    private readonly tsconfig: TTypeScript.ParsedCommandLine
  ) {}

  public compile() {
    const host = this.ts.createCompilerHost(this.tsconfig.options);

    const program = this.ts.createProgram(
      this.tsconfig.fileNames,
      this.tsconfig.options,
      host,
      undefined,
      this.ts.getConfigFileParsingDiagnostics(this.tsconfig)
    );

    program.emit();
  }

  private createWatchCompilerHost(system?: TTypeScript.System) {
    const host: TTypeScript.SolutionBuilderWithWatchHost<TTypeScript.EmitAndSemanticDiagnosticsBuilderProgram> =
      this.ts.createSolutionBuilderWithWatchHost(
        system,
        this.createSolutionProgramWithMultiEmit(),
        this.reportDiagnostic,
        this.reportDiagnostic,
        this.reportDiagnostic
      );

    return host;
  }

  private createSolutionProgramWithMultiEmit(): TTypeScript.CreateProgram<TTypeScript.EmitAndSemanticDiagnosticsBuilderProgram> {
    return (
      rootNames?: readonly string[] | undefined,
      options?: TTypeScript.CompilerOptions,
      host?: TTypeScript.CompilerHost,
      oldProgram?: TTypeScript.EmitAndSemanticDiagnosticsBuilderProgram,
      configFileParsingDiagnostics?: readonly TTypeScript.Diagnostic[],
      projectReferences?: readonly TTypeScript.ProjectReference[] | undefined
    ): TTypeScript.EmitAndSemanticDiagnosticsBuilderProgram => {
      this.ts.performance.disable();
      this.ts.performance.enable();

      const program: TTypeScript.EmitAndSemanticDiagnosticsBuilderProgram =
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

  private updateProgramForMultiEmit(
    program: TTypeScript.Program,
    moduleKindsToEmit: IEmitModuleKind[]
  ): TTypeScript.Program {
    const emit = program.emit;
    const getCompilerOptions = program.getCompilerOptions

    program.emit = (
      targetSourceFile?: TTypeScript.SourceFile,
      writeFile?: TTypeScript.WriteFileCallback,
      cancellationToken?: TTypeScript.CancellationToken,
      emitOnlyDtsFiles?: boolean,
      customTransformers?: TTypeScript.CustomTransformers
    ) => {
      if (emitOnlyDtsFiles) {
        return emit(
          targetSourceFile,
          writeFile,
          cancellationToken,
          emitOnlyDtsFiles,
          customTransformers
        );
      }

      const diagnostics: TTypeScript.Diagnostic[] = [];
      let emitSkipped: boolean = false;

      for (const moduleKindToEmit of moduleKindsToEmit) {

      }

      return {
        diagnostics,
        emitSkipped,
      };
    };

    return program;
  }



  private reportDiagnostic(diagnostic: TTypeScript.Diagnostic): void {
    this.diagnostics.push(diagnostic);
  }
}
