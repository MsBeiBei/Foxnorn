import type { TTypescript } from ".";

export type ExtensionKind = ".cjs" | ".mjs" | ".js";

export type InternalModuleFormat = "amd" | "cjs" | "es" | "system" | "umd";

export type ModuleFormat =
  | InternalModuleFormat
  | "commonjs"
  | "esm"
  | "systemjs";

export interface Output {
  outDir: string;
  module: TTypescript.ModuleKind;
  extension: ExtensionKind;
}
