import type { ExtendedTypescript, TTypescript, Output } from "../types";

export function createProgram(ts: ExtendedTypescript) {
  return (
    rootNames: readonly string[] | undefined,
    options: TTypescript.CompilerOptions | undefined,
    host?: TTypescript.CompilerHost,
    oldProgram?: TTypescript.EmitAndSemanticDiagnosticsBuilderProgram,
    configFileParsingDiagnostics?: readonly TTypescript.Diagnostic[],
    projectReferences?: readonly TTypescript.ProjectReference[]
  ) => {
    ts.performance.disable();
    ts.performance.enable();

    const builderProgram: TTypescript.EmitAndSemanticDiagnosticsBuilderProgram =
      ts.createEmitAndSemanticDiagnosticsBuilderProgram(
        rootNames,
        options,
        host,
        oldProgram,
        configFileParsingDiagnostics,
        projectReferences
      );

    return builderProgram;
  };
}

export function createEmit(
  ts: ExtendedTypescript,
  program: TTypescript.BuilderProgram,
  outputs: Output[]
): TTypescript.Program["emit"] {
  const options: TTypescript.CompilerOptions = program.getCompilerOptions();

  return (
    targetSourceFile?: TTypescript.SourceFile,
    writeFile?: TTypescript.WriteFileCallback,
    cancellationToken?: TTypescript.CancellationToken,
    emitOnlyDtsFiles?: boolean,
    customTransformers?: TTypescript.CustomTransformers
  ): TTypescript.EmitResult => {
    if (emitOnlyDtsFiles) {
      return program.emit(
        targetSourceFile,
        writeFile,
        cancellationToken,
        emitOnlyDtsFiles,
        customTransformers
      );
    }

    let emitSkipped: boolean = false;
    let diagnostics: TTypescript.Diagnostic[] = [];

    try {
      for (const output of outputs) {
        program.getCompilerOptions = () => ({
          ...options,
          module: output.module,
          outDir: output.outDir,
          declaration: false,
          declarationMap: false,
        });

        const emitResult = program.emit(
          targetSourceFile,
          writeFile,
          cancellationToken,
          emitOnlyDtsFiles,
          customTransformers
        );

        emitSkipped = emitSkipped || emitResult.emitSkipped;

        for (const diagnostic of emitResult.diagnostics) {
          diagnostics.push(diagnostic);
        }
      }

      return {
        emitSkipped,
        diagnostics: ts.sortAndDeduplicateDiagnostics(diagnostics),
      };
    } finally {
      program.getCompilerOptions = () => options;
    }
  };
}
