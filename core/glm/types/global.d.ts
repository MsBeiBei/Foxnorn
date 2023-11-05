declare interface FixedLengthArray<T extends unknown, L extends number>
  extends Array<T> {
  0: T;
  length: L;
}

declare type Equal<A extends number, B extends number> = A extends B
  ? B extends A
    ? true
    : false
  : false;
