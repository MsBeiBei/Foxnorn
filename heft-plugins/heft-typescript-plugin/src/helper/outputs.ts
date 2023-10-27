import { ModuleKind } from "typescript";
import { isAbsolute, resolve } from "path";
import { Path } from "@rushstack/node-core-library";
import { isPlainObject, isArray } from "@foxnorn/shared";
import type { TTypescript } from "./compile";

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
  module?: ModuleKind | undefined;
  extension?: ExtensionType | undefined;
}

export function getModuleKind(format: ModuleFormat): TTypescript.ModuleKind {
  switch (format) {
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

export function normalizeOutputOptions(
  output: PartialProperties<OutputOptions, "format">,
  project: string
): RequiredProperties<OutputOptions, "module"> {
  let moduleKind = output.module as ModuleKind;

  if (!moduleKind) {
    moduleKind = getModuleKind(output.format as ModuleFormat);
  }

  let outDir: string = output.dir;

  if (!isAbsolute(outDir)) {
    outDir = resolve(project, outDir);
  }

  outDir = Path.convertToSlashes(outDir);
  outDir = outDir.replace(/\/*$/, "/");

  return {
    ...output,
    dir: outDir,
    module: moduleKind,
  };
}

export function getEmitOptionsByOutputs(
  outputs: Omit<OutputOptions, "module">[],
  tsconfig: TTypescript.ParsedCommandLine,
  project: string
): RequiredProperties<OutputOptions, "module">[];

export function getEmitOptionsByOutputs(
  outputs: Omit<OutputOptions, "module">,
  tsconfig: TTypescript.ParsedCommandLine,
  project: string
): RequiredProperties<OutputOptions, "module">[];

export function getEmitOptionsByOutputs(
  outputs: undefined,
  tsconfig: TTypescript.ParsedCommandLine,
  project: string
): RequiredProperties<OutputOptions, "module">[];

export function getEmitOptionsByOutputs(
  outputs: unknown,
  tsconfig: TTypescript.ParsedCommandLine,
  project: string
): RequiredProperties<OutputOptions, "module">[] {
  if (isPlainObject<Omit<OutputOptions, "module">>(outputs)) {
    return [normalizeOutputOptions(outputs, project)];
  }

  if (isArray<Omit<OutputOptions, "module">[]>(outputs)) {
    const moduleKindsToEmit: RequiredProperties<OutputOptions, "module">[] = [];

    for (const output of outputs) {
      const options = normalizeOutputOptions(output, project);

      for (const existingModuleKindToEmit of moduleKindsToEmit) {
        if (options.dir === existingModuleKindToEmit.dir) {
          if (options.extension === options.extension) {
          }
        } else {
        }
      }
    }
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
      },
      project
    ),
  ];
}
