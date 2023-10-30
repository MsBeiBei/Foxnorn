import type { ExtendedTypeScript, TTypescript } from "../types/typescript";
import type { OutputOptions } from "./outputs";
import { getOverrideWriteFile } from "./writerFile";

export function createEmit(
  ts: ExtendedTypeScript,
  program: TTypescript.Program,
  outputs: RequiredProperties<OutputOptions, "module">[]
): TTypescript.Program["emit"] {
  const originalEmit = program.emit;
  const ordinalGetCompilerOptions = program.getCompilerOptions;

  return (
    targetSourceFile?: TTypescript.SourceFile,
    writeFile?: TTypescript.WriteFileCallback,
    cancellationToken?: TTypescript.CancellationToken,
    emitOnlyDtsFiles?: boolean,
    customTransformers?: TTypescript.CustomTransformers
  ): TTypescript.EmitResult => {
    if (emitOnlyDtsFiles) {
      return originalEmit(
        targetSourceFile,
        writeFile,
        cancellationToken,
        emitOnlyDtsFiles,
        customTransformers
      );
    }

    const diagnostics: TTypescript.Diagnostic[] = [];
    let emitSkipped: boolean = false;

    const originalCompilerOptions: TTypescript.CompilerOptions =
      program.getCompilerOptions();

    for (const output of outputs) {
      const kindCompilerOptions: TTypescript.CompilerOptions = {
        ...ordinalGetCompilerOptions(),
        module: output.module,
        outDir: output.dir,
        declaration: false,
        declarationMap: false,
      };

      program.getCompilerOptions = () => kindCompilerOptions;
      
      // Need to mutate the compiler options for the `module` field specifically, because emitWorker() captures
      // options in the closure and passes it to `ts.getTransformers()`
      originalCompilerOptions.module = output.module;

      const emitResult: TTypescript.EmitResult = originalEmit(
        targetSourceFile,
        writeFile && getOverrideWriteFile(writeFile, output.extension),
        cancellationToken,
        emitOnlyDtsFiles,
        customTransformers
      );

      emitSkipped = emitSkipped ?? emitResult.emitSkipped;

      for (const diagnostic of emitResult.diagnostics) {
        diagnostics.push(diagnostic);
      }
    }

    return {
      diagnostics: ts.sortAndDeduplicateDiagnostics(diagnostics),
      emitSkipped,
    };
  };
}
