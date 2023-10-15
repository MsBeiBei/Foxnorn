import { HeftLogger } from "@foxnorn/heft-lib";
import { type ITypeScriptConfigurationJson } from "./HeftTypeScriptPlugin";
import { TypeScriptCore } from "./TypeScriptCore";

export interface ITypeScriptBuilderConfiguration
  extends ITypeScriptConfigurationJson {
  buildFolderPath: string;
  typeScriptToolPath: string;
  tsconfigFilePath: string;
  heftLogger: HeftLogger;
}

export class TypeScriptBuilder {
  constructor(public readonly configuration: ITypeScriptBuilderConfiguration) {}
}
