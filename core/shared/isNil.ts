export function isNil(input: unknown): input is null | undefined {
  return input === undefined || input === null;
}
