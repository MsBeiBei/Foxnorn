import type TTypescript from "typescript";

export type ExtendedTypeScript = typeof TTypescript & {
  performance: {
    mark(name: string): void;
    measure(name: string, startMark?: string, endMark?: string): void;
    disable(): void;
    enable(): void;
  };
};

export interface LibraryOptions {
  outDir: string;
  module: TTypescript.ModuleKind;
  extension?: string;
}

export interface TypeScriptCoreConfiguration {
  ts: ExtendedTypeScript;
  tsconfig: TTypescript.ParsedCommandLine;
  system: TTypescript.System;
  libraries: LibraryOptions[];
}

export function getLibraryEmit(
  ts: ExtendedTypeScript,
  program: TTypescript.Program,
  libraries: LibraryOptions[]
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

    for (const library of libraries) {
      const kindCompilerOptions: TTypescript.CompilerOptions = {
        ...ordinalGetCompilerOptions(),
        module: library.module,
        outDir: library.outDir,
        declaration: false,
        declarationMap: false,
      };

      program.getCompilerOptions = () => kindCompilerOptions;
      const emitResult: TTypescript.EmitResult = originalEmit(
        targetSourceFile,
        writeFile && getOverrideWriteFile(writeFile, library.extension),
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

const JS_EXTENSION_REGEX: RegExp = /\.js(\.map)?$/;

export function getOverrideWriteFile(
  writerFile: TTypescript.WriteFileCallback,
  jsExtensionOverride?: string
) {
  if (!jsExtensionOverride) {
    return writerFile;
  }

  const replacementExtension: string = `${jsExtensionOverride}$1`;
  return (
    fileName: string,
    text: string,
    writeByteOrderMark: boolean,
    onError?: (message: string) => void,
    sourceFiles?: readonly TTypescript.SourceFile[],
    data?: TTypescript.WriteFileCallbackData
  ) => {
    return writerFile(
      fileName.replace(JS_EXTENSION_REGEX, replacementExtension),
      text,
      writeByteOrderMark,
      onError,
      sourceFiles,
      data
    );
  };
}

export function createLibraryProgram() {}

export class TypeScriptCore {
  constructor(private readonly configuration: TypeScriptCoreConfiguration) {}

  public compile() {
    const { ts, tsconfig, libraries } = this.configuration;

    const host: TTypescript.CompilerHost = ts.createCompilerHost(
      tsconfig.options
    );

    const program: TTypescript.Program = ts.createProgram(
      tsconfig.fileNames,
      tsconfig.options,
      host,
      undefined,
      ts.getConfigFileParsingDiagnostics(tsconfig)
    );

    const emit = getLibraryEmit(ts, program, libraries);

    const emitResult: TTypescript.EmitResult = emit(
      undefined,
      ts.sys.writeFile,
      undefined,
      undefined,
      undefined
    );

    ts.performance.disable();
    ts.performance.enable();
  }

  public compileIncrement() {
    const { ts, tsconfig, libraries } = this.configuration;

    const host: TTypescript.CompilerHost = ts.createIncrementalCompilerHost(
      tsconfig.options
    );

    const oldProgram:
      | TTypescript.EmitAndSemanticDiagnosticsBuilderProgram
      | undefined = ts.readBuilderProgram(tsconfig.options, host);

    const builderProgram: TTypescript.EmitAndSemanticDiagnosticsBuilderProgram =
      ts.createEmitAndSemanticDiagnosticsBuilderProgram(
        tsconfig.fileNames,
        tsconfig.options,
        host,
        oldProgram,
        ts.getConfigFileParsingDiagnostics(tsconfig),
        tsconfig.projectReferences
      );

    const program: TTypescript.Program = builderProgram.getProgram();

    const emit = getLibraryEmit(ts, program, libraries);

    const emitResult: TTypescript.EmitResult = emit(
      undefined,
      ts.sys.writeFile,
      undefined,
      undefined,
      undefined
    );

    ts.performance.disable();
    ts.performance.enable();
  }

  public compileWatch() {}
}
