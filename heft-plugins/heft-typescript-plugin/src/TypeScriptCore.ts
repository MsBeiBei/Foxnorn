import type TTypescript from "typescript";

export type ExtendedTypeScript = typeof TTypescript;

export type ModuleFormat =
  | "commonjs"
  | "amd"
  | "umd"
  | "system"
  | "es2015"
  | "esnext";

export interface BundleBuildOptions {
  outDir: string;
  module: ModuleFormat;
}

export class TypeScriptCore {
  constructor(
    private readonly ts: ExtendedTypeScript,
    private readonly tsconfig: TTypescript.ParsedCommandLine,
    private readonly buildOptions: BundleBuildOptions[]
  ) {}

  public compile() {}

  public compileWatch() {}

  private createIncrementalCompilerHost(
    system?: TTypescript.System
  ): TTypescript.CompilerHost {
    let host: TTypescript.CompilerHost;

    if (this.tsconfig.options.incremental) {
      host = this.ts.createIncrementalCompilerHost(
        this.tsconfig.options,
        system
      );
    } else {
      host = this.ts.createCompilerHost(this.tsconfig.options);
    }

    return host;
  }
}
