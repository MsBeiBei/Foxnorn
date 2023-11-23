import type { ExtendedTypescript, TTypescript } from "../types/typescript";

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

    const builderProgram = ts.createEmitAndSemanticDiagnosticsBuilderProgram(
      rootNames,
      options,
      host,
      oldProgram,
      configFileParsingDiagnostics,
      projectReferences
    );

    return builderProgram
  };
}
