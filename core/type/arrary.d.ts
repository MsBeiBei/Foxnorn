declare interface FixedLengthArray<T extends unknown, L extends number>
  extends Array<T> {
  0: T;
  length: L;
}

declare type Length<T extends unknown[]> = T extends { length: infer L }
  ? L
  : never;
