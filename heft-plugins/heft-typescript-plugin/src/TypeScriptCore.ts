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

export interface ProgramOptions<T extends TTypeScript.BuilderProgram> {
  rootNames: readonly string[];
  options: TTypeScript.CompilerOptions;
  host?: TTypeScript.CompilerHost;
  configFileParsingDiagnostics?: readonly TTypeScript.Diagnostic[];
  projectReferences?: readonly TTypeScript.ProjectReference[];
  createProgram?: TTypeScript.CreateProgram<T>;
}

const INNER_EMIT_SYMBOL: unique symbol = Symbol("emit");

export class TypeScriptCore {
  private readonly tsconfig: TTypeScript.ParsedCommandLine;

  constructor(
    private readonly ts: ExtendedTypeScript,
    private readonly configFileName: string
  ) {
    this.tsconfig = this.loadTsconfigFile();
  }

  public compile() {
    const host: TTypeScript.CompilerHost = this.ts.createCompilerHost(
      this.tsconfig.options
    );

    const p: any = this.createProgram({
      rootNames: this.tsconfig.fileNames,
      options: this.tsconfig.options,
      projectReferences: this.tsconfig.projectReferences,
      host,
      configFileParsingDiagnostics: this.ts.getConfigFileParsingDiagnostics(
        this.tsconfig
      ),
    });

    this.ts.createProgram(
      this.tsconfig.fileNames,
      this.tsconfig.options,
      host,
      un,
      configFileParsingDiagnostics,
      projectReferences
    )

    p.emit(undefined, this.ts.sys.writeFile, undefined, true, undefined);
  }

  private createProgram<
    T extends TTypeScript.BuilderProgram = TTypeScript.EmitAndSemanticDiagnosticsBuilderProgram
  >({
    rootNames,
    options,
    configFileParsingDiagnostics,
    projectReferences,
    host,
    createProgram,
  }: ProgramOptions<T>) {
    host = host || this.ts.createIncrementalCompilerHost(options);

    createProgram =
      createProgram ||
      (this.ts
        .createEmitAndSemanticDiagnosticsBuilderProgram as any as TTypeScript.CreateProgram<T>);

    const oldProgram = this.ts.readBuilderProgram(options, host) as any as T;

    const program: T & {
      [INNER_EMIT_SYMBOL]?: TTypeScript.Program["emit"];
    } = createProgram(
      rootNames,
      options,
      host,
      oldProgram,
      configFileParsingDiagnostics,
      projectReferences
    );

    program.emit = (
      targetSourceFile?: TTypeScript.SourceFile,
      writeFile?: TTypeScript.WriteFileCallback,
      cancellationToken?: TTypeScript.CancellationToken,
      emitOnlyDtsFiles?: boolean,
      customTransformers?: TTypeScript.CustomTransformers
    ): TTypeScript.EmitResult | any => {
      if (emitOnlyDtsFiles) {
        return program[INNER_EMIT_SYMBOL]!(
          targetSourceFile,
          writeFile,
          cancellationToken,
          emitOnlyDtsFiles,
          customTransformers
        );
      }
    };
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
}
