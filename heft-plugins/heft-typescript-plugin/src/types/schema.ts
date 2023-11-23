import type { TTypescript } from ".";

export interface DtsConfig {
  compilerOptions?: TTypescript.CompilerOptions;
}

export interface Schema {
  /**
   * Clean output directory before each build.
   */
  clean?: false | true | string[];

  /**
   * Suppress non-error logs (excluding "onSuccess" process output)
   */
  silent?: boolean;

  legacyOutput?: any;

  dts?: false | true | DtsConfig;
}
