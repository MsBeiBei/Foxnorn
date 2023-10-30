import type { TTypescript } from "../types/typescript";

export function getSourceFileFromBuilderProgram(
  program: TTypescript.BuilderProgram
): Map<string, string> {
  const changedFilesSet: Set<string> = (
    program as unknown as TTypescript.BuilderProgram & {
      getState(): { changedFilesSet: Set<string> };
    }
  ).getState().changedFilesSet;

  const sourceFiles: Map<string, string> = new Map();

  for (const fileName of changedFilesSet) {
    const sourceFile: TTypescript.SourceFile | undefined =
      program.getSourceFile(fileName);
    if (sourceFile && !sourceFile.isDeclarationFile) {
      sourceFiles.set(sourceFile.fileName, sourceFile.text);
    }
  }

  return sourceFiles;
}

export function getSourceFileFromProgram(
  program: TTypescript.Program
): Map<string, string> {
  const sourceFiles: Map<string, string> = new Map();

  for (const sourceFile of program.getSourceFiles()) {
    if (!sourceFile.isDeclarationFile) {
      sourceFiles.set(sourceFile.fileName, sourceFile.text);
    }
  }
  return sourceFiles;
}
