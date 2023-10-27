import type TTypescript from "typescript";
import type { ITerminal } from "@rushstack/node-core-library";

export type ExtendedTypeScript = typeof TTypescript & {
  performance: {
    mark(name: string): void;
    measure(name: string, startMark?: string, endMark?: string): void;
    disable(): void;
    enable(): void;
    getDuration(name: string): number;
    getCount(name: string): number;
  };
};

export class DiagnosticCore {
  private diagnostics: TTypescript.Diagnostic[] = [];
}

export class TypeScriptCore {
  constructor(
    private readonly ts: ExtendedTypeScript,
    private readonly project: string,
    private readonly terminal: ITerminal
  ) {}

  public async compile() {}

  public async compileIncremental() {}

  public async compileWatch() {}
}
