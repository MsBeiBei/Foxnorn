export function is<C extends () => any>(
  ctor: C,
  input: unknown
): input is ReturnType<C>;
export function is<C extends new () => any>(
  ctor: C,
  input: unknown
): input is InstanceType<C>;
export function is<C extends () => any>(
  ctor: C
): (input: unknown) => input is ReturnType<C>;
export function is<C extends new () => any>(
  ctor: C
): (input: unknown) => input is InstanceType<C>;

export function is<C extends () => any>(ctor: C, input?: unknown) {
  if (arguments.length === 1) return (_input: unknown) => is(ctor, _input);

  return (input != null && input.constructor === ctor) || input instanceof ctor;
}
