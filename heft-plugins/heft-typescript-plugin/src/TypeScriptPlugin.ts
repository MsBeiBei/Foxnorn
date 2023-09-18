import type { IHeftTaskSession, HeftConfiguration } from "@rushstack/heft";
import { HeftPlugin } from "@foxnorn/heft-lib";
import { TypeScriptFileLoader } from "./TypeScriptFileLoader";

export const PLUGIN_NAME: "typescript-plugin" = "typescript-plugin";

export default class TypeScriptPlugin extends HeftPlugin {
  override PLUGIN_NAME: string = PLUGIN_NAME;

  override async run(
    taskSession: IHeftTaskSession,
    heftConfiguration: HeftConfiguration
  ) {
    const typeScriptConfiguration = await TypeScriptFileLoader.loadConfigurationFileAsync(
      taskSession,
      heftConfiguration
    );

    this.logger.log(typeScriptConfiguration)
  }
}
