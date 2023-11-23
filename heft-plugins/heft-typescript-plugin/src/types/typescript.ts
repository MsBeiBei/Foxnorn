import type * as TTypescript from "typescript";

export interface Performance {
  disable(): void;
  enable(system?: TTypescript.System): true;
}

export type ExtendedTypescript = typeof TTypescript & {
  performance: Performance;
};

export { TTypescript };
