import type { HeftConfiguration, IHeftTaskSession } from "@rushstack/heft";
import { type ITerminal } from "@rushstack/node-core-library";
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
  ) {}

  private async getTypeScriptBuilderAsync(
    taskSession: IHeftTaskSession,
    heftConfiguration: HeftConfiguration
  ): Promise<TypeScriptBuilder | undefined> {
    const terminal: ITerminal = taskSession.logger.terminal;

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
        terminal
      );

    const typeScriptBuilderConfiguration: ITypeScriptBuilderConfiguration = {
      buildFolderPath: heftConfiguration.buildFolderPath,
      typeScriptToolPath: typeScriptToolPath,
      tsconfigPath: this.getTsconfigFilePath(
        heftConfiguration,
        typeScriptConfigurationJson
      ),
    };

    return new TypeScriptBuilder(typeScriptBuilderConfiguration);
  }
}
