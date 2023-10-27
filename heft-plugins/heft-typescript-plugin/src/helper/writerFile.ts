import type { TTypescript } from "./compile";

const JS_EXTENSION_REGEX: RegExp = /\.js(\.map)?$/;

export function getOverrideWriteFile(
  writerFile: TTypescript.WriteFileCallback,
  jsExtensionOverride?: string
) {
  if (!jsExtensionOverride) {
    return writerFile;
  }

  const replacementExtension: string = `${jsExtensionOverride}$1`;

  return (
    fileName: string,
    text: string,
    writeByteOrderMark: boolean,
    onError?: (message: string) => void,
    sourceFiles?: readonly TTypescript.SourceFile[],
    data?: TTypescript.WriteFileCallbackData
  ) => {
    return writerFile(
      fileName.replace(JS_EXTENSION_REGEX, replacementExtension),
      text,
      writeByteOrderMark,
      onError,
      sourceFiles,
      data
    );
  };
}
