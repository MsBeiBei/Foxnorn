import type TTypescript from "typescript";
import type { OutputOptions } from "./helper/outputs";

export { TTypescript };

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

export interface TypeScriptOptions {
  project: string;
  reference?: boolean;
  worker?: boolean;
  outputs?: OutputOptions | OutputOptions[];
}

export class TypeScriptCore {
  private readonly ts: ExtendedTypeScript;
  private readonly options: TypeScriptOptions;

  public constructor(ts: ExtendedTypeScript, options: TypeScriptOptions) {
    this.ts = ts;
    this.options = options;
  }

  public async execute() {}
}
