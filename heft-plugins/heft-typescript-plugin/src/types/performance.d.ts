export type PerformanceMeasure = <T extends object | void>(
  measureName: string,
  fn: () => T
) => T & { duration: number; count: number };

export type PerformanceMeasureAsync = <T extends object | void>(
  measureName: string,
  fn: () => Promise<T>
) => Promise<T & { duration: number; count: number }>;
