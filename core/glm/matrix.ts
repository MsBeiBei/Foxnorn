import { type Vector } from "./vector";

export type Matrix<D extends number> = FixedLengthArray<number, D>;

/**
 * Returns the identity matrix for an NxN matrix.
 *
 * @param n Size of the matrix to create.
 * @returns NxN identity matrix.
 */
export function identity<D extends number>(n: D): Matrix<D> {
  const matrix = new Array<number>(n * n);

  for (let row = 0; row < n; row++) {
    for (let col = 0; col < n; col++) {
      matrix[n * col + row] = row === col ? 1 : 0;
    }
  }

  return matrix as Matrix<D>;
}
