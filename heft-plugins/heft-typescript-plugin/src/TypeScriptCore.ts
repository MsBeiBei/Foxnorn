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
};

export class EmitModuleKind {
  constructor(
    public readonly module: TTypeScript.ModuleKind,
    public readonly outDir: string,
    public readonly extension: string
  ) {}
}

export class TypeScriptCore {
  constructor(
    public readonly ts: ExtendedTypeScript,
    public readonly configFileName: string
  ) {}

  public compile() {
    const tsconfig: TTypeScript.ParsedCommandLine = this.loadTsconfigFile();
    const host: TTypeScript.CompilerHost = this.createCompilerHost(tsconfig);

    let builderProgram: TTypeScript.BuilderProgram | undefined = undefined;
    let innerProgram: TTypeScript.Program;

    if (tsconfig.options.incremental) {
      const oldProgram:
        | TTypeScript.EmitAndSemanticDiagnosticsBuilderProgram
        | undefined = this.ts.readBuilderProgram(tsconfig.options, host);
      builderProgram = this.ts.createEmitAndSemanticDiagnosticsBuilderProgram(
        tsconfig.fileNames,
        tsconfig.options,
        host,
        oldProgram,
        this.ts.getConfigFileParsingDiagnostics(tsconfig),
        tsconfig.projectReferences
      );
      innerProgram = builderProgram.getProgram();
    } else {
      innerProgram = this.ts.createProgram({
        rootNames: tsconfig.fileNames,
        options: tsconfig.options,
        projectReferences: tsconfig.projectReferences,
        host,
        oldProgram: undefined,
        configFileParsingDiagnostics: this.ts.getConfigFileParsingDiagnostics(tsconfig)
      });
    }
  }

  private loadTsconfigFile(): TTypeScript.ParsedCommandLine {
    const readResult = this.ts.readConfigFile(
      this.configFileName,
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
      dirname(this.configFileName),
      undefined,
      this.configFileName
    );

    return config;
  }

  private createCompilerHost(
    tsconfig: TTypeScript.ParsedCommandLine,
    system?: TTypeScript.System
  ): TTypeScript.CompilerHost {
    let host: TTypeScript.CompilerHost;

    if (tsconfig.options.incremental) {
      host = this.ts.createIncrementalCompilerHost(tsconfig.options, system);
    } else {
      host = this.ts.createCompilerHost(tsconfig.options);
    }

    return host;
  }
}
