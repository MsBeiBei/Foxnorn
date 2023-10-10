import type { ExtendedTypeScript } from "../types/typescript";

/**
 * Adds a performance measurement with the specified name.
 *
 * @param ts The TypeScript compiler
 * @param measureName The name of the performance measurement.
 * @param cb The action to prepare for the performance measurement.
 *
 * @internal
 */
export function measureTsPerformance<T extends object | void>(
  ts: ExtendedTypeScript,
  measureName: string,
  cb: () => T
): T & {
  duration: number;
  count: number;
} {
  const startMarkName = `before${measureName}`;
  ts.performance.makr(startMarkName);
  const result: T = cb();
  const endMarkName = `after${measureName}`;
  ts.performance.mark(endMarkName);
  ts.performance.measure(measureName, startMarkName, endMarkName);

  return {
    ...result,
    duration: ts.performance.getDuration(measureName),
    count: ts.performance.getCount(startMarkName),
  };
}
