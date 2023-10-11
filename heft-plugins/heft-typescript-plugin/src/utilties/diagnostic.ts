import type TTypeScript from "typescript";
import type { ExtendedTypeScript } from "../types/typescript";
import { FileError } from "@rushstack/node-core-library";

export function printDiagnosticMessage(
  ts: ExtendedTypeScript,
  projectFolder: string,
  diagnostic: TTypeScript.Diagnostic
) {
  let diagnosticMessage: string;
  let errorObject: Error;

  if (diagnostic.file) {
    const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(
      diagnostic.start ?? 0
    );
    const message = ts.flattenDiagnosticMessageText(
      diagnostic.messageText,
      "\n"
    );
    const formattedMessage = `(TS${diagnostic.code}) ${message}`;
    errorObject = new FileError(formattedMessage, {
      absolutePath: diagnostic.file.fileName,
      projectFolder,
      line: line + 1,
      column: character + 1,
    });
    diagnosticMessage = errorObject.toString();
  } else {
    diagnosticMessage = ts.flattenDiagnosticMessageText(
      diagnostic.messageText,
      "\n"
    );
    errorObject = new Error(diagnosticMessage);
  }
}
