import { ModuleKind } from "typescript";
import { resolve } from "path";
import { Path } from "@rushstack/node-core-library";
import { isPlainObject, isArray } from "@foxnorn/shared";
import type { TTypescript } from "../types/typescript";

export type ExtensionType = ".cjs" | ".mjs" | ".js";

export type InternalModuleFormat = "amd" | "cjs" | "es" | "system" | "umd";

export type ModuleFormat =
  | InternalModuleFormat
  | "commonjs"
  | "esm"
  | "systemjs";

export interface OutputOptions {
  dir: string;
  format: ModuleFormat;
  module?: ModuleKind;
  extension?: ExtensionType;
}

export function getModuleKind(format: ModuleFormat): TTypescript.ModuleKind {
  switch (format.toLowerCase()) {
    case "es":
    case "esm": {
      return ModuleKind.ESNext;
    }
    case "cjs":
    case "commonjs": {
      return ModuleKind.CommonJS;
    }
    case "system":
    case "systemjs": {
      return ModuleKind.System;
    }
    case "amd": {
      return ModuleKind.AMD;
    }
    case "umd": {
      return ModuleKind.UMD;
    }
    default: {
      throw new Error(`"${format}" is not a valid format name.`);
    }
  }
}

export function getOutDir(...paths: string[]) {
  return Path.convertToSlashes(resolve(...paths)).replace(/\/*$/, "/"); // Ensure the path ends with a slash.
}

export function normalizeOutputOptions<T extends OutputOptions>(
  output: T,
  tsconfig: TTypescript.ParsedCommandLine,
  project: string
): RequiredProperties<T, "module"> {
  let moduleKind = output.module as ModuleKind;

  if (!moduleKind) {
    moduleKind = getModuleKind(output.format as ModuleFormat);
  }

  let outDir: string = getOutDir(
    project,
    tsconfig.options.outDir ?? ".",
    output.dir
  );

  return {
    ...output,
    dir: outDir,
    module: moduleKind,
  };
}

export function getOutputsForEmit<T extends OutputOptions = OutputOptions>(
  outputs: T | T[] | undefined,
  tsconfig: TTypescript.ParsedCommandLine,
  project: string
): RequiredProperties<T, "module">[] {
  if (isPlainObject<T>(outputs)) {
    return [normalizeOutputOptions(outputs, tsconfig, project)];
  }

  if (isArray<T[]>(outputs)) {
    const moduleKindsToEmit: RequiredProperties<T, "module">[] = [];

    for (const output of outputs) {
      const options = normalizeOutputOptions(output, tsconfig, project);


      for (const existingModuleKindToEmit of moduleKindsToEmit) {
        if (options.dir === existingModuleKindToEmit.dir) {
          if (options.extension === options.extension) {
            throw new Error(
              `Unable to output two different module kinds with the ` +
                `same module extension (${options.extension || ".js"}) to ` +
                `the same folder ("${options.dir}").`
            );
          }
        } else {
          if (options.dir.startsWith(existingModuleKindToEmit.dir)) {
            throw new Error(
              `Unable to output two different module kinds to nested folders ` +
                `("${existingModuleKindToEmit.dir}" and "${options.dir}").`
            );
          }

          if (options.dir.endsWith(existingModuleKindToEmit.dir)) {
            throw new Error(
              `Unable to output two different module kinds to nested folders ` +
                `("${options.dir}" and "${existingModuleKindToEmit.dir}").`
            );
          }
        }
      }

      moduleKindsToEmit.push(options);
    }

    return moduleKindsToEmit;
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
      "If the module tsconfig compilerOption is not provided, the builder must be provided with the " +
        "output configuration option."
    );
  }

  if (!tsconfig.options.outDir) {
    throw new Error(
      "If the outDir tsconfig compilerOption is not provided, the builder must be provided with the " +
        "output configuration option."
    );
  }

  return [
    normalizeOutputOptions(
      {
        module: tsconfig.options.module,
        dir: tsconfig.options.outDir,
      } as T,
      tsconfig,
      project
    ),
  ];
}
