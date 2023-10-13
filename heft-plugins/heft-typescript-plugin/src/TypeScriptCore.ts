import type TTypeScript from "typescript";

export type ExtendedTypeScript = typeof TTypeScript & {
  performance: Performance;
};

export interface Performance {
  mark(name: string): void;
  measure(name: string, startMark?: string, endMark?: string): void;
  clearMeasures(name?: string): void;
  clearMarks(name?: string): void;
  now(): number;
  timeOrigin: number;
}

export class TypeScriptCore {
  constructor(public readonly ts: ExtendedTypeScript) {}

  public createCompilerHost(
    command: TTypeScript.ParsedCommandLine,
    system?: TTypeScript.System
  ): TTypeScript.CompilerHost | undefined {
    let host: TTypeScript.CompilerHost | undefined;

    if (command.options.incremental) {
      host = this.ts.createIncrementalCompilerHost(command.options, system);
    } else {
      host = this.ts.createCompilerHost(command.options);
    }

    return host;
  }

  private measurePerformance<T extends object | void>(
    measureName: string,
    fn: () => T
  ) {
    const startMarkName = `before${measureName}`
    const endMarkName = `before${measureName}`
  }
}
