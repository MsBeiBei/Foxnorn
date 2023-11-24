import type { TTypescript } from ".";

export type Format = "esm" | "cjs" | "umd";

export type DtsConfig = {
  /** Emit declaration files only */
  only?: boolean;

  /**
   * Specify the directory where declaration files are output.
   */
  outDir?: string;

  /**
   * Overrides `compilerOptions`
   * This option takes higher priority than `compilerOptions` in tsconfig.json
   */
  compilerOptions?: TTypescript.CompilerOptions;
};

export type Schema = {
  /**
   * Output different formats to different directories instead of using different extensions.
   * @default true
   */
  legacyOutput?: boolean;

  /**
   * Directory to serve as plain static assets. Files in this directory are copied
   * to build dist dir as-is without transform. The value can be either an absolute
   * file system path or a path relative to project root.
   *
   * Set to `false` or an empty string to disable copied static assets to build dist dir.
   * @default 'public'
   */
  publicDir?: string | false;

  /**
   * Specify additional picomatch patterns to be treated as static assets.
   */
  assetsInclude?: string | string[];

  /**
    @default true
   */
  clearScreen?: boolean;

  /**
   * Specify output directory.
   * @default 'dist'
   */
  outDir?: string;

  /**
   * Clean output directory before each build.
   * @default true
   */
  clean?: boolean | string[];

  /**
   * Specify the format of the output file.
   * @default ['esm','umd']
   */
  format?: Format[] | Format;

  /**
   * @default true
   */
  dts?: boolean | DtsConfig;
};
