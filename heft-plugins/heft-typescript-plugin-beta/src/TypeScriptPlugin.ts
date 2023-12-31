import type { HeftConfiguration, IHeftTaskSession } from "@rushstack/heft";
import { type ITerminal } from "@rushstack/node-core-library";
import {
  HeftTypeScriptPlugin,
  type TypeScriptConfigurationJson,
  type ITsconfigJson,
} from "./HeftTypeScriptPlugin";
import {
  TypeScriptBuilder,
  type TypeScriptBuilderConfiguration,
} from "./TypeScriptBuilder";

export const PLUGIN_NAME: "typescript-plugin" = "typescript-plugin";

export default class TypeScriptPlugin extends HeftTypeScriptPlugin {
  public apply(
    taskSession: IHeftTaskSession,
    heftConfiguration: HeftConfiguration
  ): void {
    taskSession.hooks.run.tapPromise(PLUGIN_NAME, async () => {
      const builder: TypeScriptBuilder | undefined =
        await this._getTypeScriptBuilderAsync(taskSession, heftConfiguration);

      if (builder) {
        await builder.invokeAsync();
      }
    });
  }

  private async _getTypeScriptBuilderAsync(
    taskSession: IHeftTaskSession,
    heftConfiguration: HeftConfiguration
  ): Promise<TypeScriptBuilder | undefined> {
    const terminal: ITerminal = taskSession.logger.terminal;

    const typeScriptConfigurationJson: TypeScriptConfigurationJson | undefined =
      await this.loadTypeScriptConfigurationFileAsync(
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

    const typeScriptBuilderConfiguration: TypeScriptBuilderConfiguration = {
      typeScriptToolPath: typeScriptToolPath,
      tsconfigPath: this.getTsconfigFilePath(
        heftConfiguration,
        typeScriptConfigurationJson
      ),
      buildFolderPath: heftConfiguration.buildFolderPath,
      scopedLogger: taskSession.logger,
      output: typeScriptConfigurationJson?.output!,
    };

    return new TypeScriptBuilder(typeScriptBuilderConfiguration);
  }
}
