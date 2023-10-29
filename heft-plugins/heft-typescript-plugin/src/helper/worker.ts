import { parentPort, workerData } from "worker_threads";
import type { ExtendedTypeScript, TTypescript } from "../types/typescript";

export interface WorkerData {
  typeScriptToolPath: string;
}

export interface TransferRequestMessage {
  requestId: number;
  options: TTypescript.CompilerOptions;
  sourceFiles: ReadonlyArray<TTypescript.SourceFile>;
}

const typescriptWorkerData: WorkerData = workerData;

const ts: ExtendedTypeScript = require(typescriptWorkerData.typeScriptToolPath);

parentPort?.on("message", (message: TransferRequestMessage | undefined) => {
  if (!message) {
    process.exit(0);
  }

  const { requestId, options, sourceFiles } = message;

  for (const [key, value] of Object.entries(ts.getDefaultCompilerOptions())) {
    if (options[key] === undefined) {
      options[key] = value;
    }
  }
});
