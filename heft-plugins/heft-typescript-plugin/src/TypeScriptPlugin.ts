import type { HeftConfiguration, IHeftTaskSession } from "@rushstack/heft";
import {
  HeftTypeScriptPlugin,
  type ITypeScriptConfigurationFile,
  type ITsconfigFile,
} from "./HeftTypeScriptPlugin";
import {
  TypeScriptBuilder,
  type ITypeScriptBuilderConfiguration,
} from "./TypeScriptBuilder";

export const PLUGIN_NAME: "typescript-plugin" = "typescript-plugin";

export default class TypeScriptPlugin extends HeftTypeScriptPlugin {
  override PLUGIN_NAME: string = PLUGIN_NAME;

  override async run(
    taskSession: IHeftTaskSession,
    heftConfiguration: HeftConfiguration
  ): Promise<void> {
    const builder: TypeScriptBuilder | undefined =
      await this._getTypeScriptBuilderAsync(taskSession, heftConfiguration);

    if (builder) {
      await builder.invokeAsync();
    }
  }

  private async _getTypeScriptBuilderAsync(
    taskSession: IHeftTaskSession,
    heftConfiguration: HeftConfiguration
  ): Promise<TypeScriptBuilder | undefined> {
    // 解析typescript.json
    const typeScriptConfigurationFile:
      | ITypeScriptConfigurationFile
      | undefined = await this.loadTypeScriptConfigurationFileAsync(
      taskSession,
      heftConfiguration
    );

    // 解析tsconfig.json
    const tsconfigFile: ITsconfigFile | undefined =
      await this.loadTsconfigFileAsync(
        taskSession,
        heftConfiguration,
        typeScriptConfigurationFile
      );

    if (!tsconfigFile) {
      return Promise.resolve(undefined);
    }

    const typeScriptToolPath = await this.getTypeScriptToolPath(
      taskSession,
      heftConfiguration
    );

    const typeScriptBuilderConfiguration: ITypeScriptBuilderConfiguration = {
      buildFolderPath: heftConfiguration.buildFolderPath,
      tempFolderPath: taskSession.tempFolderPath,
      typeScriptToolPath,

      buildProjectReferences:
        typeScriptConfigurationFile?.buildProjectReferences,

      heftLogger: this.heftLogger,
    };

    const typeScriptBuilder: TypeScriptBuilder = new TypeScriptBuilder(
      typeScriptBuilderConfiguration
    );

    return typeScriptBuilder;
  }
}
