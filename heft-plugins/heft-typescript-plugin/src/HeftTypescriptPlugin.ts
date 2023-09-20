import { resolve } from "path";
import type { IHeftTaskSession, HeftConfiguration } from "@rushstack/heft";
import {
  ConfigurationFile,
  PathResolutionMethod,
  InheritanceType,
} from "@rushstack/heft-config-file";
import { Path, FileSystem, type ITerminal } from "@rushstack/node-core-library";
import { HeftPlugin } from "@foxnorn/heft-lib";


export interface IConfigurationFile {
  /*
   * Specifies the tsconfig.json file that will be used for compilation. Equivalent to the "project" argument for the 'tsc' and 'tslint' command line tools.
   *
   * The default value is "./tsconfig.json"
   */
  project?: string;
}

export interface IPartialTsconfigCompilerOptions {
  outDir?: string;
}

export interface IPartialTsconfig {
  compilerOptions?: IPartialTsconfigCompilerOptions;
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

  static async getTypeScriptPackagePath(
    taskSession: IHeftTaskSession,
    heftConfiguration: HeftConfiguration
  ): Promise<string> {
    const terminal: ITerminal = taskSession.logger.terminal;

    return await heftConfiguration.rigPackageResolver.resolvePackageAsync(
      "typescript",
      terminal
    );
  }

  static async loadPartialTsconfigFileAsync<
    TConfigurationFile extends IConfigurationFile
  >(
    taskSession: IHeftTaskSession,
    heftConfiguration: HeftConfiguration,
    configurationFile?: TConfigurationFile
  ): Promise<IPartialTsconfig | undefined> {
    const terminal: ITerminal = taskSession.logger.terminal;

    // The folder location where build is located
    const buildFolderPath: string = heftConfiguration.buildFolderPath;

    const tsconfigFilePath = HeftTypescriptPlugin.getTsconfigFilePath(
      heftConfiguration,
      configurationFile
    );

    terminal.writeVerboseLine(`Looking for tsconfig at ${tsconfigFilePath}`);
    const tsconfigExists: boolean = await FileSystem.existsAsync(
      tsconfigFilePath
    );

    if (!tsconfigExists) return;

    // The folder where the schema is stored
    const schemaFolderPath: string = resolve(
      __dirname,
      `schemas/tsconfig.schema.json`
    );

    const partialTsconfigFileLoader = new ConfigurationFile<IPartialTsconfig>({
      projectRelativeFilePath: configurationFile?.project ?? "tsconfig.json",
      jsonSchemaPath: schemaFolderPath,
      propertyInheritance: {
        compilerOptions: {
          inheritanceType: InheritanceType.merge,
        },
      },
      jsonPathMetadata: {
        "$.compilerOptions.outDir": {
          pathResolutionMethod:
            PathResolutionMethod.resolvePathRelativeToConfigurationFile,
        },
      },
    });

    const partialTsconfigFilePromise =
      partialTsconfigFileLoader.loadConfigurationFileForProjectAsync(
        terminal,
        buildFolderPath,
        heftConfiguration.rigConfig
      );

    return await partialTsconfigFilePromise;
  }
}
