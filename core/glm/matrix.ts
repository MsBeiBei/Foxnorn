export type Matrix<D extends number> = FixedLengthArray<number, D>;

export function create() {}

export function clone() {}

export function copy() {}

export function identity<D extends number>(dimession: D): Matrix<D> {
  const matrix = new Array();

  for (let row = 0; row < dimession; row++) {
    let rows = [];
    for (let col = 0; col < dimession; col++) {
      rows[col] = row === col ? 1 : 0;
    }

    matrix.push(...rows);
  }

  return matrix as Matrix<D>;
}
