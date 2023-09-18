import { resolve } from "path";
import type { IHeftTaskSession, HeftConfiguration } from "@rushstack/heft";
import { ConfigurationFile } from "@rushstack/heft-config-file";
import { Path, type ITerminal } from "@rushstack/node-core-library";
import { HeftPlugin } from "@foxnorn/heft-lib";

export interface IConfigurationFile {
  /*
   * Specifies the tsconfig.json file that will be used for compilation. Equivalent to the "project" argument for the 'tsc' and 'tslint' command line tools.
   *
   * The default value is "./tsconfig.json"
   */
  project?: string;
}

export abstract class HeftTypescriptPlugin extends HeftPlugin {
  static async loadConfigurationFileAsync<
    TConfigurationFile extends IConfigurationFile
  >(
    taskSession: IHeftTaskSession,
    heftConfiguration: HeftConfiguration
  ): Promise<TConfigurationFile | undefined> {
    const terminal: ITerminal = taskSession.logger.terminal;

    // The folder location where build is located
    const buildFolderPath: string = heftConfiguration.buildFolderPath;

    // The folder where the schema is stored
    const schemaFolderPath: string = resolve(
      __dirname,
      `schemas/typescript.schema.json`
    );

    const typeScriptConfigurationFileLoader =
      new ConfigurationFile<TConfigurationFile>({
        projectRelativeFilePath: "config/typescript.json",
        jsonSchemaPath: schemaFolderPath,
      });

    // Find and return a configuration file for the specified project, automatically resolving
    const typescriptConfigurationFilePromise =
      typeScriptConfigurationFileLoader.tryLoadConfigurationFileForProjectAsync(
        terminal,
        buildFolderPath,
        heftConfiguration.rigConfig
      );

    return await typescriptConfigurationFilePromise;
  }

  static getTsconfigFilePath<TConfigurationFile extends IConfigurationFile>(
    heftConfiguration: HeftConfiguration,
    configurationFile?: TConfigurationFile
  ): string {
    return Path.convertToSlashes(
      // Use path.resolve because the path can start with `./` or `../`
      resolve(
        heftConfiguration.buildFolderPath,
        configurationFile?.project || "./tsconfig.json"
      )
    );
  }

  static async loadPartialTsconfigFileAsync<
    TConfigurationFile extends IConfigurationFile
  >(
    taskSession: IHeftTaskSession,
    heftConfiguration: HeftConfiguration,
    configurationFile?: TConfigurationFile
  ) {
    const terminal: ITerminal = taskSession.logger.terminal;

    // The folder location where build is located
    const buildFolderPath: string = heftConfiguration.buildFolderPath;


    
  }
}
