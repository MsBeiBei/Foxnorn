import { dirname } from "path";
import type TTypeScript from "typescript";

export interface IExtendedTypeScript {
  performance: {
    mark(name: string): void;
    measure(name: string, startMark?: string, endMark?: string): void;
    getDuration(measureName: string): number;
    getCount(measureName: string): number;
  };
}

export type ExtendedTypeScript = typeof TTypeScript & IExtendedTypeScript;

export interface IProgramOptions<T extends TTypeScript.BuilderProgram> {
  rootNames: readonly string[];
  options: TTypeScript.CompilerOptions;
  host?: TTypeScript.CompilerHost;
  configFileParsingDiagnostics?: readonly TTypeScript.Diagnostic[];
  projectReferences?: readonly TTypeScript.ProjectReference[];
  createProgram?: TTypeScript.CreateProgram<T>;
}

export interface ICachedEmitModuleKind {
  moduleKind: TTypeScript.ModuleKind;
  outFolderPath: string;
  extension?: string;
}

const INNER_EMIT_SYMBOL: unique symbol = Symbol("emit");
const INNER_GET_COMPILER_OPTIONS_SYMBOL: unique symbol =
  Symbol("getCompilerOptions");

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

    this.createProgram({
      rootNames: this.tsconfig.fileNames,
      options: this.tsconfig.options,
      projectReferences: this.tsconfig.projectReferences,
      host,
      configFileParsingDiagnostics: this.ts.getConfigFileParsingDiagnostics(
        this.tsconfig
      ),
    });
  }

  public complieWatch() {}

  private createProgram<
    T extends TTypeScript.BuilderProgram = TTypeScript.EmitAndSemanticDiagnosticsBuilderProgram
  >({
    rootNames,
    options,
    configFileParsingDiagnostics,
    projectReferences,
    host,
    createProgram,
  }: IProgramOptions<T>) {
    host = host || this.ts.createIncrementalCompilerHost(options);

    createProgram =
      createProgram ||
      (this.ts
        .createEmitAndSemanticDiagnosticsBuilderProgram as any as TTypeScript.CreateProgram<T>);

    const oldProgram = this.ts.readBuilderProgram(options, host) as any as T;

    const program: T & {
      [INNER_EMIT_SYMBOL]?: TTypeScript.Program["emit"];
      [INNER_GET_COMPILER_OPTIONS_SYMBOL]?: TTypeScript.Program["getCompilerOptions"];
    } = createProgram(
      rootNames,
      options,
      host,
      oldProgram,
      configFileParsingDiagnostics,
      projectReferences
    );

    program[INNER_EMIT_SYMBOL] = program.emit;
    program[INNER_GET_COMPILER_OPTIONS_SYMBOL] = program.getCompilerOptions;

    program.emit = (
      targetSourceFile?: TTypeScript.SourceFile,
      writeFile?: TTypeScript.WriteFileCallback,
      cancellationToken?: TTypeScript.CancellationToken,
      emitOnlyDtsFiles?: boolean,
      customTransformers?: TTypeScript.CustomTransformers
    ): TTypeScript.EmitResult => {
      if (emitOnlyDtsFiles) {
        return program[INNER_EMIT_SYMBOL]!(
          targetSourceFile,
          writeFile,
          cancellationToken,
          emitOnlyDtsFiles,
          customTransformers
        );
      }

      const diagnostics: TTypeScript.Diagnostic[] = [];
      let emitSkipped: boolean = false;

      return {
        emitSkipped,
        diagnostics,
      };
    };

    return program;
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

export type ModuleFormat = ".cjs" | ".mjs" | ".js";

const JS_EXTENSION_REGEX: RegExp = /\.js(\.map)?$/;

export function writeFile(
  callback: TTypeScript.WriteFileCallback,
  format?: ModuleFormat
) {
  if (!format) {
    return callback;
  }
  const replacementExtension: string = `${format}$1`;

  return (
    fileName: string,
    text: string,
    writeByteOrderMark: boolean,
    onError?: (message: string) => void,
    sourceFiles?: readonly TTypeScript.SourceFile[],
    data?: TTypeScript.WriteFileCallbackData
  ) =>
    callback(
      fileName.replace(JS_EXTENSION_REGEX, replacementExtension),
      text,
      writeByteOrderMark,
      onError,
      sourceFiles,
      data
    );
}
