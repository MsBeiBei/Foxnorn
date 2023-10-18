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

export type Measure = <T extends object | void>(
  measureName: string,
  fn: () => T
) => T & { duration: number };

export type ExtendedTypeScript = typeof TTypeScript & IExtendTypeScript;
