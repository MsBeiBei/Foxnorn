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

export class TypeScriptCore {
  private readonly diagnostics: TTypeScript.Diagnostic[] = [];

  constructor(
    private readonly ts: ExtendedTypeScript,
    private readonly tsconfig: TTypeScript.ParsedCommandLine,
  ) {}

  private reportDiagnostic(diagnostic: TTypeScript.Diagnostic): void {
    this.diagnostics.push(diagnostic);
  }
}
