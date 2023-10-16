import { dirname } from "path";
import type TTypeScript from "typescript";

export interface Performance {
  mark(name: string): void;
  measure(name: string, startMark?: string, endMark?: string): void;
  getDuration(measureName: string): number;
  getCount(measureName: string): number;
}

export type ExtendedTypeScript = typeof TTypeScript & {
  performance: Performance;
  getEmitModuleKind: (
    compilerOptions: TTypeScript.CompilerOptions
  ) => TTypeScript.ModuleKind;
};

export class EmitModuleKind {
  constructor(
    public readonly module: TTypeScript.ModuleKind,
    public readonly outDir: string,
    public readonly extension: string
  ) {}
}

export class TypeScriptCore {
  private tsconfig: TTypeScript.ParsedCommandLine;
  private host: TTypeScript.CompilerHost | undefined;

  constructor(
    public readonly ts: ExtendedTypeScript,
    public readonly project: string,
    public readonly typeScriptVersion?: string
  ) {
    this.tsconfig = this.loadTsconfigFile();
    this.host = this.createCompilerHost(this.tsconfig);
  }

  public compileFiles() {}

  private createCompilerHost(
    tsconfig: TTypeScript.ParsedCommandLine,
    system?: TTypeScript.System
  ): TTypeScript.CompilerHost | undefined {
    let host: TTypeScript.CompilerHost | undefined;

    if (tsconfig.options.incremental) {
      host = this.ts.createIncrementalCompilerHost(tsconfig.options, system);
    } else {
      host = this.ts.createCompilerHost(tsconfig.options);
    }

    return host;
  }

  private loadTsconfigFile(): TTypeScript.ParsedCommandLine {
    const readResult = this.ts.readConfigFile(
      this.project,
      this.ts.sys.readFile
    );

    const config = this.ts.parseJsonConfigFileContent(
      readResult.config,
      {
        fileExists: this.ts.sys.fileExists,
        readFile: this.ts.sys.readFile,
        readDirectory: this.ts.sys.readDirectory,
        useCaseSensitiveFileNames: true,
      },
      dirname(this.project),
      undefined,
      this.project
    );
    return config;
  }

  public measureTsPerformance<T extends object | void>(
    measureName: string,
    fn: () => T
  ): T & {
    duration: number;
    count: number;
  } {
    const startMarkName = `before${measureName}`;
    this.ts.performance.mark(startMarkName);
    const result: T = fn();
    const endMarkName = `before${measureName}`;
    this.ts.performance.mark(endMarkName);
    this.ts.performance.measure(measureName, startMarkName, endMarkName);

    return {
      ...result,
      duration: this.ts.performance.getDuration(measureName),
      count: this.ts.performance.getCount(startMarkName),
    };
  }

  private getExtension(
    ts: ExtendedTypeScript,
    compilerOptions: TTypeScript.CompilerOptions
  ) {
    const moduleKind = ts.getEmitModuleKind(compilerOptions);

    if (moduleKind === ts.ModuleKind.CommonJS) {
      return ".cjs";
    }
    if (moduleKind >= ts.ModuleKind.ES2015) {
      return ".mjs";
    }

    return ".js";
  }
}
