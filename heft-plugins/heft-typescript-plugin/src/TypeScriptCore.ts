import type TTypeScript from "typescript";

export interface IExtendTypeScript {
  performance: {
    mark(measureName: string): void;
    measure(measureName: string, startMark?: string, endMark?: string): void;
    getDuration(measureName: string): number;
    getCount(measureName: string): number;
    enable(): void;
    disable(): void;
  };
}

export type ExtendedTypeScript = typeof TTypeScript & IExtendTypeScript;

const JS_EXTENSION_REGEX: RegExp = /\.js(\.map)?$/;

export class TypeScriptCore {
  private readonly diagnostics: TTypeScript.Diagnostic[] = [];

  constructor(
    private readonly ts: ExtendedTypeScript,
    private readonly tsconfig: TTypeScript.ParsedCommandLine,
    private readonly formats?: TTypeScript.ModuleKind[]
  ) {}

  public compile() {}

  public compileWatch() {}

  private createForProgramMultiEmit(program: TTypeScript.Program) {
    const emit = program.emit;

    program.emit = (
      targetSourceFile?: TTypeScript.SourceFile,
      writeFile?: TTypeScript.WriteFileCallback,
      cancellationToken?: TTypeScript.CancellationToken,
      emitOnlyDtsFiles?: boolean,
      customTransformers?: TTypeScript.CustomTransformers
    ) => {
      const diagnostics: TTypeScript.Diagnostic[] = [];
      let emitSkipped: boolean = false;

      return {
        diagnostics,
        emitSkipped,
      };
    };

    return program;
  }

  private writeFile(
    callback: TTypeScript.WriteFileCallback,
    jsExtensionOverride?: string
  ) {
    if (!jsExtensionOverride) {
      return callback;
    }

    const replacementExtension: string = `${jsExtensionOverride}$1`;

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

  private getFileExtension(module: TTypeScript.ModuleKind) {
    if (module === this.ts.ModuleKind.CommonJS) {
      return ".cjs";
    }
    if (module >= this.ts.ModuleKind.ES2015) {
      return ".mjs";
    }
    return ".js";
  }

  private reportDiagnostic(diagnostic: TTypeScript.Diagnostic): void {
    this.diagnostics.push(diagnostic);
  }
}
