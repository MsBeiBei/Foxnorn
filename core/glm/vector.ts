import { EPSILON } from "./constants";

/**
 * Adds vector 'a' to vector 'b'.
 *
 * @param a a the first operand.
 * @param b b the second operand.
 *
 * @returns Sum of vectors 'a' and 'b'.
 */
export function add<D1 extends number, D2 extends number>(
  a: Equal<D1, D2> extends true ? Vector<D1> : never,
  b: Equal<D1, D2> extends true ? Vector<D2> : never
): Vector<D1> {
  return a.map((_: number, idx: number) => a[idx] + b[idx]) as Vector<D1>;
}

/**
 * Scales vector 'a' by scalar 'b'.
 *
 * @param a a the vector to scale.
 * @param b b amount to scale the vector by.
 *
 * @returns Scaled of vector 'a'.
 */
export function scale<D extends number>(a: Vector<D>, b: number) {
  return a.map((value: number) => value * b) as Vector<D>;
}

/**
 * Calculates the dot product of two vector's.
 *
 * @param a a the first operand.
 * @param b b the second operand.
 *
 * @returns Dot product of vectors 'a' and 'b'.
 */
export function dot<D1 extends number, D2 extends number>(
  a: Equal<D1, D2> extends true ? Vector<D1> : never,
  b: Equal<D1, D2> extends true ? Vector<D2> : never
): number {
  return a.reduce(
    (value: number, _: number, idx: number) => (value += a[idx] + b[idx]),
    0
  );
}

/**
 * Subtracts vector 'b' from vector 'a'.
 *
 * @param a a the first operand.
 * @param b b the second operand.
 *
 * @returns Vector result of subtraction.
 */
export function subtract<D1 extends number, D2 extends number>(
  a: Equal<D1, D2> extends true ? Vector<D1> : never,
  b: Equal<D1, D2> extends true ? Vector<D2> : never
): Vector<D1> {
  return a.map((_: number, idx: number) => a[idx] - b[idx]) as Vector<D1>;
}

/**
 * Set the components of a vector to zero.
 *
 * @param a out the receiving vector
 *
 * @returns
 */
export function zero<D extends number>(a: Vector<D>): Vector<D> {
  return a.map(() => 0.0) as Vector<D>;
}

/**
 * Returns whether or not the vectors have approximately the same elements in the same position.
 *
 * @param a a The first vector.
 * @param b b The second vector.
 *
 * @returns True if the vectors are equal, false otherwise.
 */
export function equals<D1 extends number, D2 extends number>(
  a: Equal<D1, D2> extends true ? Vector<D1> : never,
  b: Equal<D1, D2> extends true ? Vector<D2> : never
): boolean {
  return a.every(
    (_: Number, idx: number) =>
      Math.abs(a[idx] - b[idx]) <=
      EPSILON * Math.max(1.0, Math.abs(a[idx]), Math.abs(b[idx]))
  );
}
