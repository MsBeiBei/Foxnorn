export type Types =
  | "Object"
  | "Number"
  | "Boolean"
  | "String"
  | "Null"
  | "Array"
  | "RegExp"
  | "NaN"
  | "Function"
  | "Undefined"
  | "Async"
  | "Promise"
  | "Symbol"
  | "Set"
  | "Error"
  | "Map"
  | "WeakMap"
  | "Generator"
  | "GeneratorFunction"
  | "BigInt"
  | "ArrayBuffer"
  | "Date";

export function type(input: unknown): Types {
  if (input === null) {
    return "Null";
  }
  if (input === undefined) {
    return "Undefined";
  }
  if (Number.isNaN(input)) {
    return "NaN";
  }

  const resultType = Object.prototype.toString.call(input).slice(8, -1);

  return (resultType === "AsyncFunction" ? "Promise" : resultType) as Types;
}
