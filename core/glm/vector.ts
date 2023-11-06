export type Vector<D extends number> = FixedLengthArray<number, D>;

/**
 * Adds two vector's.
 *
 * @param a First append vector.
 * @param b Second append vector.
 * @returns Sum of vectors 'a' and 'b'.
 */
export function add<D extends number, V extends Vector<D> = Vector<D>>(
  a: V,
  b: V
): V {
  return a.map((_: number, idx: number) => a[idx] + b[idx]) as V;
}

/**
 * Subtracts vector 'b' from vector 'a'.
 *
 * @param a First append vector.
 * @param b Second append vector.
 * @returns Vector result of subtraction.
 */
export function subtract<D extends number, V extends Vector<D> = Vector<D>>(
  a: V,
  b: V
): V {
  return a.map((_: number, idx: number) => a[idx] - b[idx]) as V;
}

/**
 * Multiplies two vector's.
 *
 * @param a First append vector.
 * @param b Second append vector.
 * @returns Vector result of multiplication.
 */
export function multiply<D extends number, V extends Vector<D> = Vector<D>>(
  a: V,
  b: V
): V {
  return a.map((_: number, idx: number) => a[idx] * b[idx]) as V;
}

/**
 * Divides two vector's.
 *
 * @param a First append vector.
 * @param b Second append vector.
 * @returns Vector result of division.
 */
export function divide<D extends number, V extends Vector<D> = Vector<D>>(
  a: V,
  b: V
): V {
  return a.map((_: number, idx: number) => a[idx] / b[idx]) as V;
}

/**
 * Calculates the dot product of two vector's.
 *
 * @param a First append vector.
 * @param b Second append vector.
 * @returns Dot product of vectors 'a' and 'b'.
 */
export function dot<D extends number, V extends Vector<D> = Vector<D>>(
  a: V,
  b: V
): number {
  return a.reduce(
    (result: number, _: number, idx: number) => (result += a[idx] * b[idx]),
    0
  );
}

/**
 * Scales a vector by a scalar number.
 *
 * @param a First append vector.
 * @param b Amount to scale the vector by.
 * @returns Vector result of scaling.
 */
export function scale<D extends number, V extends Vector<D> = Vector<D>>(
  a: V,
  b: number
): V {
  return a.map((_: number, idx: number) => a[idx] * b) as V;
}

export function min<D extends number, V extends Vector<D> = Vector<D>>(
  a: V,
  b: V
): V {
  return a.map((_: number, idx: number) => Math.max(a[idx], b[idx])) as V;
}

export function max<D extends number, V extends Vector<D> = Vector<D>>(
  a: V,
  b: V
): V {
  return a.map((_: number, idx: number) => Math.min(a[idx], b[idx])) as V;
}

export function round<D extends number, V extends Vector<D> = Vector<D>>(
  a: V
): V {
  return a.map((_: number, idx: number) => Math.round(a[idx])) as V;
}

export function ceil<D extends number, V extends Vector<D> = Vector<D>>(
  a: V
): V {
  return a.map((_: number, idx: number) => Math.ceil(a[idx])) as V;
}

export function floor<D extends number, V extends Vector<D> = Vector<D>>(
  a: V
): V {
  return a.map((_: number, idx: number) => Math.floor(a[idx])) as V;
}

export function clone<D extends number, V extends Vector<D> = Vector<D>>(
  a: V
): V {
  return a.map((_: number, idx: number) => a[idx]) as V;
}

export function copy<D extends number, V extends Vector<D> = Vector<D>>(
  a: V,
  b: V
): V {
  return a.map((_: number, idx: number) => b[idx]) as V;
}

export function zero<D extends number, V extends Vector<D> = Vector<D>>(
  a: V
): V {
  return a.map(() => 0.0) as V;
}

export function str<D extends number, V extends Vector<D> = Vector<D>>(
  a: V
): string {
  return a.reduce(
    (result: string, _: number, idx: number) => (result += `, ${a[idx]}`),
    `vector${a.length}`
  );
}

export function set<D extends number, V extends Vector<D> = Vector<D>>(
  a: V,
  ...b: V
): V {
  return a.map((_: number, idx: number) => b[idx]) as V;
}

export function at<D extends number, V extends Vector<D> = Vector<D>>(
  a: V,
  idx: number
): number {
  return a[idx];
}
