import type TTypescript from "typescript";

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
  constructor(private readonly ts: ExtendedTypeScript) {}
}
