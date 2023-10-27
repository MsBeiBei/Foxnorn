import { isAbsolute, resolve } from "path";
import type TTypescript from "typescript";
import { Path } from "@rushstack/node-core-library";
import type { IScopedLogger } from "@rushstack/heft";
import type { ExtendedTypeScript } from "../types/typescript";

export type InternalModuleFormat = "amd" | "cjs" | "es" | "system" | "umd";

export type IModuleFormat =
  | InternalModuleFormat
  | "commonjs"
  | "esm"
  | "systemjs";

export interface IOutputOptions {
  dir: string;
  format?: IModuleFormat;
  module?: TTypescript.ModuleKind;
  extension?: string;
}

export type IEmitOutputOptions = IOutputOptions & {
  outDir: string;
  extension: string;
  module: TTypescript.ModuleKind;
};

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

export function getEmitForOutput(
  ts: ExtendedTypeScript,
  program: TTypescript.Program,
  outputs: IEmitOutputOptions[]
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
        module: output.module,
        outDir: output.outDir,
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
      throw new Error(`"${format}" is not a valid format name.`);
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

export function normalizeOutputOptions(
  ts: ExtendedTypeScript,
  project: string,
  output: IOutputOptions
): IEmitOutputOptions {
  if ((output.format && !output.dir) || (!output.format && output.dir)) {
    throw new Error(
      "If either the format or the dir option is provided in the output configuration option, both must be provided."
    );
  }

  if (!output.format) {
    throw new Error(
      "The format option must be provided with the output configuration option."
    );
  }

  let moduleKind = output.module as TTypescript.ModuleKind;

  if (!moduleKind) {
    moduleKind = getModuleKind(ts, output.format);
  }

  const extension = output.extension ?? getFileExtension(ts, moduleKind);

  let outDir: string = output.dir;

  if (!isAbsolute(outDir)) {
    outDir = resolve(project, outDir);
  }

  outDir = Path.convertToSlashes(outDir);
  outDir = outDir.replace(/\/*$/, "/");

  const { dir, format } = output;

  return {
    outDir,
    dir,
    format,
    extension,
    module: moduleKind,
  };
}

export function getOutputOptions(
  ts: ExtendedTypeScript,
  project: string,
  tsconfig: TTypescript.ParsedCommandLine,
  outputs: IOutputOptions,
  scopedLogger: IScopedLogger
): IEmitOutputOptions[];

export function getOutputOptions(
  ts: ExtendedTypeScript,
  project: string,
  tsconfig: TTypescript.ParsedCommandLine,
  outputs: IOutputOptions[],
  scopedLogger: IScopedLogger
): IEmitOutputOptions[];

export function getOutputOptions(
  ts: ExtendedTypeScript,
  project: string,
  tsconfig: TTypescript.ParsedCommandLine,
  outputs: IOutputOptions[],
  scopedLogger: IScopedLogger
): IEmitOutputOptions[];

export function getOutputOptions(
  ts: ExtendedTypeScript,
  project: string,
  tsconfig: TTypescript.ParsedCommandLine,
  outputs: unknown,
  scopedLogger: IScopedLogger
): IEmitOutputOptions[] | undefined {
  if (isArray<IOutputOptions[]>(outputs) && outputs.length) {
    const moduleKindsToEmit: IEmitOutputOptions[] = [];

    for (let output of outputs) {
      let message: string | undefined;

      const emitOutputOptions = normalizeOutputOptions(ts, project, output);

      const { outDir, extension } = emitOutputOptions;

      for (const existingModuleKindToEmit of moduleKindsToEmit) {
        if (existingModuleKindToEmit.outDir === outDir) {
          if (existingModuleKindToEmit?.extension === extension) {
            message =
              `Unable to output two different module kinds with the same ` +
              `module extension (${extension || ".js"})  ` +
              `to the same folder ("${outDir}").`;
          }
        } else {
          let parentDir: string | undefined;
          let childDir: string | undefined;

          if (outDir.startsWith(existingModuleKindToEmit.outDir)) {
            parentDir = outDir;
            childDir = existingModuleKindToEmit.outDir;
          } else if (existingModuleKindToEmit.outDir.startsWith(outDir)) {
            parentDir = existingModuleKindToEmit.outDir;
            childDir = outDir;
          }

          if (parentDir) {
            message =
              "Unable to output two different module kinds to nested folders " +
              `("${parentDir}" and "${childDir}").`;
          }
        }

        if (message) {
          scopedLogger.emitError(new Error(message));
          return undefined;
        }
      }

      moduleKindsToEmit.push(emitOutputOptions);
    }

    return moduleKindsToEmit;
  }

  if (isPlainObject<IOutputOptions>(outputs)) {
    return [normalizeOutputOptions(ts, project, outputs)];
  }

  if (
    (tsconfig.options.module && !tsconfig.options.outDir) ||
    (!tsconfig.options.module && tsconfig.options.outDir)
  ) {
    throw new Error(
      "If either the module or the outDir option is provided in the tsconfig compilerOptions, both must be provided."
    );
  }

  if (!tsconfig.options.module) {
    throw new Error(
      "If the module tsconfig compilerOption is not provided, the builder must be provided with the output configuration option."
    );
  }

  return [
    normalizeOutputOptions(ts, project, {
      dir: tsconfig.options.outDir,
      module: tsconfig.options.module,
    } as IOutputOptions),
  ];
}
