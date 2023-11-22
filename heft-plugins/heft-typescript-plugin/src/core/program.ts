import type { ExtendedTypescript, TTypescript } from "../types/typescript";

export function createProgram() {
  return (
    rootNames: readonly string[] | undefined,
    options: TTypescript.CompilerOptions | undefined,
    host?: TTypescript.CompilerHost,
    oldProgram?: TTypescript.EmitAndSemanticDiagnosticsBuilderProgram,
    configFileParsingDiagnostics?: readonly TTypescript.Diagnostic[],
    projectReferences?: readonly TTypescript.ProjectReference[]
  ) => {};
}
