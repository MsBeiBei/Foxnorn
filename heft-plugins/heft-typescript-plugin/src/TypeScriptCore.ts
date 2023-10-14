import { join } from "path";
import type TTypeScript from "typescript";

export interface Performance {
  /**
   * https://github.com/microsoft/TypeScript/blob/5f597e69b2e3b48d788cb548df40bcb703c8adb1/src/compiler/performance.ts#L55-L61
   */
  mark(name: string): void;

  /**
   * https://github.com/microsoft/TypeScript/blob/5f597e69b2e3b48d788cb548df40bcb703c8adb1/src/compiler/performance.ts#L72-L78
   */
  measure(name: string, startMark?: string, endMark?: string): void;

  /**
   * https://github.com/microsoft/TypeScript/blob/5f597e69b2e3b48d788cb548df40bcb703c8adb1/src/compiler/performance.ts#L55-L61
   */
  getDuration(measureName: string): number;

  /**
   * https://github.com/microsoft/TypeScript/blob/5f597e69b2e3b48d788cb548df40bcb703c8adb1/src/compiler/performance.ts#L85-L87
   */
  getCount(measureName: string): number;
}

export type ExtendedTypeScript = typeof TTypeScript & {
  performance: Performance;
};

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

  private measureTsPerformance<T extends object | void>(
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

  private printTsDiagnostics() {}
}
