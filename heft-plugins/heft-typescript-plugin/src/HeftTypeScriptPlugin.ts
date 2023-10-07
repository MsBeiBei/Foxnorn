import { resolve } from "path";
import type { HeftConfiguration, IHeftTaskSession } from "@rushstack/heft";
import { ConfigurationFile } from "@rushstack/heft-config-file";
import { FileSystem, Path, type ITerminal } from "@rushstack/node-core-library";
import { HeftPlugin } from "@foxnorn/heft-lib";

export interface ITypeScriptConfigurationFile {
  project: string;
}

export interface IPartialTsconfig {
  compilerOptions?: any;
}

export abstract class HeftTypeScriptPlugin extends HeftPlugin {
  protected async loadTypeScriptConfigurationFileAsync<
    TConfigurationFile extends ITypeScriptConfigurationFile
  >(
    taskSession: IHeftTaskSession,
    heftConfiguration: HeftConfiguration
  ): Promise<TConfigurationFile | undefined> {
    const terminal: ITerminal = taskSession.logger.terminal;

    const buildFolderPath: string = heftConfiguration.buildFolderPath;

    const typeScriptSchemaFolderPath: string = resolve(
      __dirname,
      `schemas/typescript.schema.json`
    );

    const typeScriptConfigurationFileLoader =
      new ConfigurationFile<TConfigurationFile>({
        projectRelativeFilePath: "config/typescript.json",
        jsonSchemaPath: typeScriptSchemaFolderPath,
        propertyInheritance: {},
      });

    const typescriptConfigurationFilePromise =
      typeScriptConfigurationFileLoader.tryLoadConfigurationFileForProjectAsync(
        terminal,
        buildFolderPath,
        heftConfiguration.rigConfig
      );

    return await typescriptConfigurationFilePromise;
  }

  protected async loadPartialTsconfigFileAsync<
    TConfigurationFile extends ITypeScriptConfigurationFile
  >(
    taskSession: IHeftTaskSession,
    heftConfiguration: HeftConfiguration,
    configurationFile: TConfigurationFile | undefined
  ) {
    const terminal: ITerminal = taskSession.logger.terminal;

    const buildFolderPath: string = heftConfiguration.buildFolderPath;

    const tsconfigFilePath: string = this.getTsconfigFilePath(
      heftConfiguration,
      configurationFile
    );

    this.heftLogger.debug(`Looking for tsconfig at ${tsconfigFilePath}`);

    const tsconfigExists: boolean = await FileSystem.existsAsync(
      tsconfigFilePath
    );

    if (!tsconfigExists) {
      return Promise.resolve(undefined);
    }

    const tsconfigSchemaFolderPath: string = resolve(
      __dirname,
      `schemas/tsconfig.schema.json`
    );

    const partialTsconfigFileLoader = new ConfigurationFile({
      projectRelativeFilePath: configurationFile?.project || "tsconfig.json",
      jsonSchemaPath: tsconfigSchemaFolderPath,
    });

    const partialTsconfigFilePromise =
      partialTsconfigFileLoader.loadConfigurationFileForProjectAsync(
        terminal,
        buildFolderPath,
        heftConfiguration.rigConfig
      );

    return await partialTsconfigFilePromise;
  }

  protected getTsconfigFilePath<
    TConfigurationFile extends ITypeScriptConfigurationFile
  >(
    heftConfiguration: HeftConfiguration,
    configurationFile?: TConfigurationFile
  ): string {
    
    return Path.convertToSlashes(
      resolve(
        heftConfiguration.buildFolderPath,
        configurationFile?.project || "./tsconfig.json"
      )
    );
  }
}
