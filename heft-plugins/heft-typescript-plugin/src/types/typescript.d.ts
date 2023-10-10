import type TTypeScript from "typescript";

export interface Performance {
  mark(name: string): void;
  measure(name: string, startMark?: string, endMark?: string): void;
  clearMeasures(name?: string): void;
  clearMarks(name?: string): void;
  now(): number;
  timeOrigin: number;
}

export type ExtendedTypeScript = typeof TTypescript & {
  performance: Performance;
};
