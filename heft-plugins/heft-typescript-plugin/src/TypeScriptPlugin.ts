import type { HeftConfiguration, IHeftTaskSession } from "@rushstack/heft";
import {
  HeftTypeScriptPlugin,
  type ITypeScriptConfigurationFile,
} from "./HeftTypeScriptPlugin";

export const PLUGIN_NAME: "typescript-plugin" = "typescript-plugin";

export default class TypeScriptPlugin extends HeftTypeScriptPlugin {
  override PLUGIN_NAME: string = PLUGIN_NAME;

  override async run(
    taskSession: IHeftTaskSession,
    heftConfiguration: HeftConfiguration
  ): Promise<void> {
    await this._getTypeScriptBuilderAsync(taskSession, heftConfiguration);
  }

  private async _getTypeScriptBuilderAsync(
    taskSession: IHeftTaskSession,
    heftConfiguration: HeftConfiguration
  ) {
    const typeScriptConfigurationFile:
      | ITypeScriptConfigurationFile
      | undefined = await this.loadTypeScriptConfigurationFileAsync(
      taskSession,
      heftConfiguration
    );

    await this.loadPartialTsconfigFileAsync(
      taskSession,
      heftConfiguration,
      typeScriptConfigurationFile
    );
  }
}
