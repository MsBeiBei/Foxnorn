declare type Recordable<T> = Record<string, T>;

declare type ReadonlyRecordable<T = any> = {
  readonly [key: string]: T;
};

declare type Writable<T> = {
  -readonly [P in keyof T]: T[P];
};

declare type RequiredProperties<T, K extends keyof T> = Omit<T, K> &
  Record<Pick<T, K>>;

declare type PartialProperties<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

declare type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};
