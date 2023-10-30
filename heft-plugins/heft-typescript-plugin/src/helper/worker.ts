import { parentPort, workerData } from "worker_threads";
import type {
  TranspilationRequestMessage,
  TranspilationResponseMessage,
  TypeScriptWorkerData,
} from "../types/worker";
import { getEmitForOutput } from "./emit";
import type { ExtendedTypeScript, TTypescript } from "../types/typescript";

const typedWorkerData: TypeScriptWorkerData = workerData;

const ts: ExtendedTypeScript = require(typedWorkerData.typeScriptToolPath);

function runTranspiler(
  message: TranspilationRequestMessage
): TranspilationResponseMessage {
  const { requestId, options, output, sourceFiles } = message;

  const fullySkipTypeCheck: boolean =
    options.verbatimModuleSyntax ||
    options.importsNotUsedAsValues === ts.ImportsNotUsedAsValues.Error;

  for (const [key, value] of Object.entries(ts.getDefaultCompilerOptions())) {
    if (options[key] === undefined) {
      options[key] = value;
    }
  }

  const { target: scriptTarget } = options;

  for (const option of ts.transpileOptionValueCompilerOptions) {
    options[option.name] = option.transpileOptionValue;
  }

  options["suppressOutputPathCheck"] = true;
  options["skipDefaultLibCheck"] = true;
  options["preserveValueImports"] = fullySkipTypeCheck;

  const sourceFileByPath: Map<string, TTypescript.SourceFile> = new Map();

  const includedFiles: string[] = [];
  for (const [fileName, sourceText] of sourceFiles) {
    if (sourceText) {
      const sourceFile: TTypescript.SourceFile = ts.createSourceFile(
        fileName,
        sourceText,
        scriptTarget!
      );
      sourceFile.hasNoDefaultLib = fullySkipTypeCheck;
      sourceFileByPath.set(fileName, sourceFile);
      includedFiles.push(fileName);
    }
  }

  const newLine: string = ts.getNewLineCharacter(options);

  const compilerHost: TTypescript.CompilerHost = {
    getSourceFile: (fileName: string) => sourceFileByPath.get(fileName),
    writeFile: ts.sys.writeFile,
    getDefaultLibFileName: () => "lib.d.ts",
    useCaseSensitiveFileNames: () => true,
    getCanonicalFileName: (fileName: string) => fileName,
    getCurrentDirectory: () => "",
    getNewLine: () => newLine,
    fileExists: (fileName: string) => sourceFileByPath.has(fileName),
    readFile: () => "",
    directoryExists: () => true,
    getDirectories: () => [],
  };

  const program: TTypescript.Program = ts.createProgram(
    includedFiles,
    options,
    compilerHost
  );

  const emit = getEmitForOutput(ts, program, output);

  const result: TTypescript.EmitResult = emit(
    undefined,
    ts.sys.writeFile,
    undefined,
    undefined,
    undefined
  );

  const response: TranspilationResponseMessage = {
    requestId,
    type: "success",
    result,
  };

  return response;
}

parentPort!.on("message", (message: TranspilationRequestMessage) => {
  if (!message) {
    process.exit(0);
  }

  try {
    const response: TranspilationResponseMessage = runTranspiler(message);
    parentPort!.postMessage(response);
  } catch (error: any) {
    const response: TranspilationResponseMessage<{
      message: string;
      [key: string]: unknown;
    }> = {
      requestId: message.requestId,
      type: "failed",
      result: {
        message: error.message,
        ...Object.fromEntries(Object.entries(error)),
      },
    };

    parentPort!.postMessage(response);
  }
});
