import {
  type IHeftTaskSession,
  type HeftConfiguration,
  type IHeftTaskFileOperations,
  type ICopyOperation,
} from "@rushstack/heft";
import { HeftPlugin } from "@foxnorn/heft-lib";
import {
  loadTypescriptConfiguration,
  type ITypescriptConfigurationFile,
} from "./utilties";

export const PLUGIN_NAME: "typescript-plugin" = "typescript-plugin";

export default class TypeScriptPlugin extends HeftPlugin<{}, {}> {
  override PLUGIN_NAME: string = PLUGIN_NAME;

  override async register(
    taskSession: IHeftTaskSession,
    heftConfiguration: HeftConfiguration,
    fileOperations: IHeftTaskFileOperations
  ) {
    await this.getStaticAssetCopyOperations(taskSession, heftConfiguration);

    return fileOperations;
  }

  override async run(
    _taskSession: IHeftTaskSession,
    _configuration: HeftConfiguration
  ) {
    this.logger.log("run");
  }

  override async watch() {
    this.logger.log("watch");
  }

  private async getStaticAssetCopyOperations(
    taskSession: IHeftTaskSession,
    heftConfiguration: HeftConfiguration
  ): Promise<ICopyOperation[]> {
    const typeScriptConfiguration: ITypescriptConfigurationFile | undefined =
      await loadTypescriptConfiguration(
        heftConfiguration,
        taskSession.logger.terminal
      );

    const copyOperations: ICopyOperation[] = [];

    if (
      typeScriptConfiguration?.staticAssetsToCopy?.fileExtensions?.length ||
      typeScriptConfiguration?.staticAssetsToCopy?.includeGlobs?.length ||
      typeScriptConfiguration?.staticAssetsToCopy?.excludeGlobs?.length
    ) {
    }
    
    return copyOperations;
  }
}
