export type Vector<D extends number> = FixedLengthArray<number, D>;

/**
 * Adds two vector's.
 *
 * @param a First append vector.
 * @param b Second append vector.
 * @returns Sum of vectors 'a' and 'b'.
 */
export function add<D extends number, L extends Vector<D> = Vector<D>>(
  a: L,
  b: L
): L {
  return a.map((_: number, idx: number) => a[idx] + b[idx]) as L;
}

/**
 * Subtracts vector 'b' from vector 'a'.
 *
 * @param a First append vector.
 * @param b Second append vector.
 * @returns Vector result of subtraction.
 */
export function subtract<D extends number, L extends Vector<D> = Vector<D>>(
  a: L,
  b: L
): L {
  return a.map((_: number, idx: number) => a[idx] - b[idx]) as L;
}

/**
 * Multiplies two vector's.
 *
 * @param a First append vector.
 * @param b Second append vector.
 * @returns Vector result of multiplication.
 */
export function multiply<D extends number, L extends Vector<D> = Vector<D>>(
  a: L,
  b: L
): L {
  return a.map((_: number, idx: number) => a[idx] * b[idx]) as L;
}

/**
 * Divides two vector's.
 *
 * @param a First append vector.
 * @param b Second append vector.
 * @returns Vector result of division.
 */
export function divide<D extends number, L extends Vector<D> = Vector<D>>(
  a: L,
  b: L
): L {
  return a.map((_: number, idx: number) => a[idx] / b[idx]) as L;
}

/**
 * Calculates the dot product of two vector's.
 *
 * @param a First append vector.
 * @param b Second append vector.
 * @returns Dot product of vectors 'a' and 'b'.
 */
export function dot<D extends number, L extends Vector<D> = Vector<D>>(
  a: L,
  b: L
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
export function scale<D extends number, L extends Vector<D> = Vector<D>>(
  a: L,
  b: number
): L {
  return a.map((_: number, idx: number) => a[idx] * b) as L;
}

export function min<D extends number, L extends Vector<D> = Vector<D>>(
  a: L,
  b: L
): L {
  return a.map((_: number, idx: number) => Math.max(a[idx], b[idx])) as L;
}

export function max<D extends number, L extends Vector<D> = Vector<D>>(
  a: L,
  b: L
): L {
  return a.map((_: number, idx: number) => Math.min(a[idx], b[idx])) as L;
}

export function round<D extends number, L extends Vector<D> = Vector<D>>(
  a: L
): L {
  return a.map((_: number, idx: number) => Math.round(a[idx])) as L;
}

export function ceil<D extends number, L extends Vector<D> = Vector<D>>(
  a: L
): L {
  return a.map((_: number, idx: number) => Math.ceil(a[idx])) as L;
}

export function floor<D extends number, L extends Vector<D> = Vector<D>>(
  a: L
): L {
  return a.map((_: number, idx: number) => Math.floor(a[idx])) as L;
}

export function zero<D extends number, L extends Vector<D> = Vector<D>>(
  a: L
): L {
  return a.map(() => 0.0) as L;
}

export function str<D extends number, L extends Vector<D> = Vector<D>>(
  a: L
): string {
  return a.reduce(
    (result: string, _: number, idx: number) => (result += `, ${a[idx]}`),
    `vector${a.length}`
  );
}
