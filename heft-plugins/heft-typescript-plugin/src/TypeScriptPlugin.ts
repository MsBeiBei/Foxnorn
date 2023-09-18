import type { IHeftTaskSession, HeftConfiguration } from "@rushstack/heft";
import { HeftTypescriptPlugin } from "./HeftTypescriptPlugin";
export const PLUGIN_NAME: "typescript-plugin" = "typescript-plugin";

export default class TypeScriptPlugin extends HeftTypescriptPlugin {
  override PLUGIN_NAME: string = PLUGIN_NAME;

  override async run(
    taskSession: IHeftTaskSession,
    heftConfiguration: HeftConfiguration
  ) {
    const typeScriptConfiguration =
      await HeftTypescriptPlugin.loadConfigurationFileAsync(
        taskSession,
        heftConfiguration
      );

    const path = HeftTypescriptPlugin.getTsconfigFilePath(
      heftConfiguration,
      typeScriptConfiguration
    );

    this.logger.log(path);
  }
}
