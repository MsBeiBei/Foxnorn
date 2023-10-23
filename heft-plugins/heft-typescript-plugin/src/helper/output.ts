import type TTypescript from "typescript";
import type { ExtendedTypeScript } from "../types/typescript";
import { isPlainObject, isArray } from "./is";

export type InternalModuleFormat = "amd" | "cjs" | "es" | "system" | "umd";

export type IModuleFormat =
  | InternalModuleFormat
  | "commonjs"
  | "esm"
  | "systemjs";

export interface IOutputOptions<T = IModuleFormat> {
  dir: string;
  format: T;
  extension?: string;
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

export function getOutputEmit(
  ts: ExtendedTypeScript,
  program: TTypescript.Program,
  outputs: IOutputOptions<TTypescript.ModuleKind>[]
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

    for (const output of outputs) {
      const kindCompilerOptions: TTypescript.CompilerOptions = {
        ...ordinalGetCompilerOptions(),
        module: output.format,
        outDir: output.dir,
        declaration: false,
        declarationMap: false,
      };

      program.getCompilerOptions = () => kindCompilerOptions;
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

export function getFileExtension(
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

export function normalizeOutputOptions<
  O extends boolean,
  T extends IModuleFormat = IModuleFormat,
  K extends TTypescript.ModuleKind = TTypescript.ModuleKind
>(
  ts: ExtendedTypeScript,
  outputs: IOutputOptions<O extends true ? K : T>,
  isOriginal: O
): IOutputOptions<K>;

export function normalizeOutputOptions(
  ts: ExtendedTypeScript,
  outputs: IOutputOptions,
  isOriginal: boolean
): IOutputOptions<TTypescript.ModuleKind> {
  if ((outputs.format && !outputs.dir) || (!outputs.format && outputs.dir)) {
    throw new Error(
      "If either the module or the outDir option is provided in the tsconfig compilerOptions, both must be provided."
    );
  }

  if (!outputs.format) {
    throw new Error(
      "If the module tsconfig compilerOption is not provided, the builder must be provided with the " +
        "additionalModuleKindsToEmit configuration option."
    );
  }

  if (isOriginal) {
    return outputs as unknown as IOutputOptions<TTypescript.ModuleKind>;
  }

  const moduleKind = getModuleKind(ts, outputs.format);
  const extension = outputs.extension ?? getFileExtension(ts, moduleKind);

  return {
    dir: outputs.dir,
    format: moduleKind,
    extension,
  };
}

export function getOutputOptions(
  ts: ExtendedTypeScript,
  tsconfig: TTypescript.ParsedCommandLine,
  outputs?: IOutputOptions | IOutputOptions[]
): IOutputOptions<TTypescript.ModuleKind>[] {
  if (isPlainObject<IOutputOptions>(outputs)) {
    return [normalizeOutputOptions(ts, outputs, false)];
  }

  if (isArray<IOutputOptions>(outputs) && outputs.length) {
    return outputs.map((output) => normalizeOutputOptions(ts, output, false));
  }

  return [
    normalizeOutputOptions(
      ts,
      {
        dir: tsconfig.options.outDir!,
        format: tsconfig.options.module!,
        extension: getFileExtension(ts, tsconfig.options.module!),
      },
      true
    ),
  ];
}
