import type { IHeftTaskSession, HeftConfiguration } from "@rushstack/heft";
import {
  HeftTypeScriptPlugin,
  type ITypeScriptConfigurationJson,
  type ITsconfigJson,
} from "./HeftTypeScriptPlugin";
import {
  TypeScriptBuilder,
  type ITypeScriptBuilderConfiguration,
} from "./TypeScriptBuilder";

export default class TypeScriptPlugin extends HeftTypeScriptPlugin {
  override async run(
    taskSession: IHeftTaskSession,
    heftConfiguration: HeftConfiguration
  ) {
    const builder: TypeScriptBuilder | undefined =
      await this.getTypeScriptBuilder(taskSession, heftConfiguration);

    if (builder) {
      await builder.invokeAsync();
    }
  }

  private async getTypeScriptBuilder(
    taskSession: IHeftTaskSession,
    heftConfiguration: HeftConfiguration
  ): Promise<TypeScriptBuilder | undefined> {
    const typeScriptConfigurationJson:
      | ITypeScriptConfigurationJson
      | undefined = await this.loadTypeScriptConfigurationFileAsync(
      taskSession,
      heftConfiguration
    );

    const tsconfigJson: ITsconfigJson | undefined =
      await this.loadTsconfigFileAsync(
        taskSession,
        heftConfiguration,
        typeScriptConfigurationJson
      );

    if (!tsconfigJson) {
      return Promise.resolve(undefined);
    }

    const typeScriptToolPath: string =
      await heftConfiguration.rigPackageResolver.resolvePackageAsync(
        "typescript",
        this.heftLogger.terminal
      );

    const typeScriptBuilderConfiguration: ITypeScriptBuilderConfiguration = {
      buildFolderPath: heftConfiguration.buildFolderPath,
      typeScriptToolPath,
      tsconfigPath: this.getTsconfigFilePath(
        heftConfiguration,
        typeScriptConfigurationJson
      ),
      heftLogger:this.heftLogger
    };

    return new TypeScriptBuilder(typeScriptBuilderConfiguration);
  }
}
