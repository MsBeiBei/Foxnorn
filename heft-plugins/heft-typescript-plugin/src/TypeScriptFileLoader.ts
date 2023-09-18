import type { IHeftTaskSession, HeftConfiguration } from "@rushstack/heft";
import { ConfigurationFile } from "@rushstack/heft-config-file";
import { type ITerminal } from "@rushstack/node-core-library";

export class TypeScriptFileLoader {
  static async loadConfigurationFileAsync(
    taskSession: IHeftTaskSession,
    heftConfiguration: HeftConfiguration
  ) {
    const terminal: ITerminal = taskSession.logger.terminal;

    // The folder location where build is located
    const buildFolderPath: string = heftConfiguration.buildFolderPath;

    const schemaFolderPath: string = `${__dirname}/schemas/typescript.schema.json`;

    const typeScriptConfigurationFileLoader = new ConfigurationFile({
      projectRelativeFilePath: "config/typescript.json",
      jsonSchemaPath: schemaFolderPath,
    });

    const typescriptConfigurationFilePromise =
      typeScriptConfigurationFileLoader.tryLoadConfigurationFileForProjectAsync(
        terminal,
        buildFolderPath,
        heftConfiguration.rigConfig
      );

    return await typescriptConfigurationFilePromise;
  }
}
