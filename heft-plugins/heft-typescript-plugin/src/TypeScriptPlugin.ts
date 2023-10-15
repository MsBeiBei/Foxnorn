import type { IHeftTaskSession, HeftConfiguration } from "@rushstack/heft";
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
  ) {
    const builder: TypeScriptBuilder | undefined =
      await this.getTypeScriptBuilderAsync(taskSession, heftConfiguration);

    if (builder) {
      await builder.compile();
    }
  }

  private async getTypeScriptBuilderAsync(
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

    const terminal: ITerminal = taskSession.logger.terminal;

    const typeScriptToolPath: string =
      await heftConfiguration.rigPackageResolver.resolvePackageAsync(
        "typescript",
        terminal
      );

    const tsconfigFilePath = this.getTsconfigFilePath(
      heftConfiguration,
      typeScriptConfigurationJson
    );

    const typeScriptBuilderConfiguration: ITypeScriptBuilderConfiguration = {
      buildFolderPath: heftConfiguration.buildFolderPath,
      typeScriptToolPath,
      tsconfigFilePath,
      heftLogger: this.heftLogger,
    };

    return new TypeScriptBuilder(typeScriptBuilderConfiguration);
  }
}
