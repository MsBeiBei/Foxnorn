import type TTypescript from "typescript";
import type { ExtendedTypeScript } from "../types/typescript";

export type InternalModuleFormat = "amd" | "cjs" | "es" | "system" | "umd";

export type IModuleFormat =
  | InternalModuleFormat
  | "commonjs"
  | "esm"
  | "systemjs";

export interface IOutputOptions {
  dir: string;
  format: IModuleFormat;
  extension?: string;
}

export interface IModuleKindReason {
  outDir: string;
  module: TTypescript.ModuleKind;
  extension: string;
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

export function writeOutputFile(
  ts: ExtendedTypeScript,
  program: TTypescript.Program,
  outputs: IOutputOptions[]
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

    for (const library of outputs) {
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

export function getModuleKind(
  ts: ExtendedTypeScript,
  format: IModuleFormat
): TTypescript.ModuleKind {
  switch (format) {
    case "es":
    case "esm": {
      return ts.ModuleKind.ESNext;
    }
    case "cjs":
    case "commonjs": {
      return ts.ModuleKind.CommonJS;
    }
    case "system":
    case "systemjs": {
      return ts.ModuleKind.System;
    }
    case "amd": {
      return ts.ModuleKind.AMD;
    }
    case "umd": {
      return ts.ModuleKind.UMD;
    }
    default: {
      throw new Error(`"${format}" is not a valid module kind name.`);
    }
  }
}

export function getExtension(
  ts: ExtendedTypeScript,
  moduleKind: TTypescript.ModuleKind
) {
  if (moduleKind === ts.ModuleKind.CommonJS) {
    return ".cjs";
  } else if (moduleKind! >= ts.ModuleKind.ES2015) {
    return ".mjs";
  } else {
    return ".js";
  }
}

export function normalizeOutputOptions(
  ts: ExtendedTypeScript,
  output: IOutputOptions
): IModuleKindReason {
  const moduleKind = getModuleKind(ts, output.format);
  const extension = output.extension ?? getExtension(ts, moduleKind);

  return {
    outDir: "",
    module: moduleKind,
    extension,
  };
}

export function getOutputOptions(
  ts: ExtendedTypeScript,
  tsconfig: TTypescript.ParsedCommandLine,
  outputs: IOutputOptions | IOutputOptions[]
): IModuleKindReason[] {
  if (outputs && typeof outputs === "object") {
    return [normalizeOutputOptions(ts, outputs as IOutputOptions)];
  }

  if (Array.isArray(outputs)) {
    return (outputs as IOutputOptions[]).map((output) =>
      normalizeOutputOptions(ts, output)
    );
  }

  return [
    {
      outDir: tsconfig.options.outDir!,
      module: tsconfig.options.module!,
      extension: getExtension(ts, tsconfig.options.module!),
    },
  ];
}
