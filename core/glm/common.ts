import { type Matrix } from "./matrix";
import { type Vector } from "./vector";

export function clone<D extends number, L extends Matrix<D> = Matrix<D>>(
  a: L
): L;
export function clone<D extends number, L extends Vector<D> = Vector<D>>(
  a: L
): L {
  return a.map((_: number, idx: number) => a[idx]) as L;
}

export function copy<D extends number, L extends Matrix<D> = Matrix<D>>(
  a: L,
  b: L
): L;
export function copy<D extends number, L extends Vector<D> = Vector<D>>(
  a: L,
  b: L
): L {
  return a.map((_: number, idx: number) => b[idx]) as L;
}

export function at<D extends number, L extends Matrix<D> = Matrix<D>>(
  a: L,
  idx: number
): L;
export function at<D extends number, L extends Vector<D> = Vector<D>>(
  a: L,
  idx: number
): number {
  return a[idx];
}

export function set<D extends number, L extends Matrix<D> = Matrix<D>>(
  a: L,
  ...b: L
): L;
export function set<D extends number, L extends Vector<D> = Vector<D>>(
  a: L,
  ...b: L
): L {
  return a.map((_: number, idx: number) => b[idx]) as L;
}
