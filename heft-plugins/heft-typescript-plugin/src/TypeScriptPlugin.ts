import { HeftConfiguration, type IHeftTaskSession } from "@rushstack/heft";
import { HeftTypescriptPlugin } from "./HeftTypescriptPlugin";
import { TypeScriptBuilder } from "./TypeScriptBuilder";

export const PLUGIN_NAME: "typescript-plugin" = "typescript-plugin";

export default class TypeScriptPlugin extends HeftTypescriptPlugin {
  override PLUGIN_NAME: string = PLUGIN_NAME;

  override async run(
    taskSession: IHeftTaskSession,
    heftConfiguration: HeftConfiguration
  ) {
    const typeScriptPackagePath =
      await HeftTypescriptPlugin.getTypeScriptPackagePath(
        taskSession,
        heftConfiguration
      );

    new TypeScriptBuilder({
      scopedLogger: this.logger.scopedLogger,
      typeScriptPackagePath,
    });
  }
}
