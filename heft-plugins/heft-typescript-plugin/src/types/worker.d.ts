import type { TTypescript } from "./typescript";

export interface TypeScriptWorkerData {
  typeScriptToolPath: string;
}

export type MessageType = "failed" | "success";

export interface TranspilationRequestMessage {
  requestId: number;
  options: TTypescript.CompilerOptions;
  sourceFiles: Map<string, string>;
}

export interface TranspilationResponseMessage<
  R extends object = TTypescript.EmitResult
> {
  requestId: number;
  type: MessageType;
  result: R;
}
