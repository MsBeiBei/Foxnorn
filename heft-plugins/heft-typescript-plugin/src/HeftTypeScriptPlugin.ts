import { resolve } from "path";
import type { IHeftTaskSession, HeftConfiguration } from "@rushstack/heft";
import { ConfigurationFile } from "@rushstack/heft-config-file";
import { FileSystem, Path, type ITerminal } from "@rushstack/node-core-library";
import { HeftPlugin } from "@foxnorn/heft-lib";

export const PLUGIN_NAME: "typescript-plugin" = "typescript-plugin";

export interface ITypeScriptConfigurationJson {
  project?: string;
}

let typeScriptConfigurationFilePromiseCache: Map<
  string,
  Promise<ITypeScriptConfigurationJson | undefined>
> = new Map();

let typeScriptConfigurationFileLoader:
  | ConfigurationFile<ITypeScriptConfigurationJson>
  | undefined;

export interface ITsconfigJson {}

let tsconfigFilePromiseCache: Map<
  string,
  Promise<ITsconfigJson | undefined>
> = new Map();

let tsconfigFileLoader: ConfigurationFile<ITsconfigJson> | undefined;

export class HeftTypeScriptPlugin extends HeftPlugin {
  override PLUGIN_NAME: string = PLUGIN_NAME;

  protected async loadTypeScriptConfigurationFileAsync(
    taskSession: IHeftTaskSession,
    heftConfiguration: HeftConfiguration
  ): Promise<ITypeScriptConfigurationJson | undefined> {
    const buildFolderPath: string = heftConfiguration.buildFolderPath;

    let typescriptConfigurationFilePromise:
      | Promise<ITypeScriptConfigurationJson | undefined>
      | undefined =
      typeScriptConfigurationFilePromiseCache.get(buildFolderPath);

    if (typescriptConfigurationFilePromise) {
      return await typescriptConfigurationFilePromise;
    }

    if (!typeScriptConfigurationFileLoader) {
      const typeScriptSchemaPath = resolve(
        __dirname,
        "schemas/typescript.schema.json"
      );

      typeScriptConfigurationFileLoader =
        new ConfigurationFile<ITypeScriptConfigurationJson>({
          projectRelativeFilePath: "config/typescript.json",
          jsonSchemaPath: typeScriptSchemaPath,
        });
    }
    const terminal: ITerminal = taskSession.logger.terminal;

    typescriptConfigurationFilePromise =
      typeScriptConfigurationFileLoader.tryLoadConfigurationFileForProjectAsync(
        terminal,
        buildFolderPath,
        heftConfiguration.rigConfig
      );

    typeScriptConfigurationFilePromiseCache.set(
      buildFolderPath,
      typescriptConfigurationFilePromise
    );

    return await typescriptConfigurationFilePromise;
  }

  protected async loadTsconfigFileAsync(
    taskSession: IHeftTaskSession,
    heftConfiguration: HeftConfiguration,
    typeScriptConfigurationJson?: ITypeScriptConfigurationJson
  ): Promise<ITsconfigJson | undefined> {
    const buildFolderPath: string = heftConfiguration.buildFolderPath;

    let tsconfigFilePromise: Promise<ITsconfigJson | undefined> | undefined =
      tsconfigFilePromiseCache.get(buildFolderPath);

    if (tsconfigFilePromise) {
      return await tsconfigFilePromise;
    }

    const tsconfigFilePath: string = this.getTsconfigFilePath(
      heftConfiguration,
      typeScriptConfigurationJson
    );
    const tsconfigExists: boolean = await FileSystem.existsAsync(
      tsconfigFilePath
    );

    if (!tsconfigExists) {
      tsconfigFilePromise = Promise.resolve(undefined);
    } else {
      if (!tsconfigFileLoader) {
        const tsconfigSchemaPath = resolve(
          __dirname,
          "schemas/tsconfig.schema.json"
        );

        tsconfigFileLoader = new ConfigurationFile<ITsconfigJson>({
          projectRelativeFilePath:
            typeScriptConfigurationJson?.project || "tsconfig.json",
          jsonSchemaPath: tsconfigSchemaPath,
        });
      }
      const terminal: ITerminal = taskSession.logger.terminal;

      tsconfigFilePromise =
        tsconfigFileLoader.loadConfigurationFileForProjectAsync(
          terminal,
          buildFolderPath,
          heftConfiguration.rigConfig
        );
    }

    tsconfigFilePromiseCache.set(buildFolderPath, tsconfigFilePromise);

    return await tsconfigFilePromise;
  }

  protected getTsconfigFilePath(
    heftConfiguration: HeftConfiguration,
    typeScriptConfigurationJson?: ITypeScriptConfigurationJson
  ): string {
    return Path.convertToSlashes(
      resolve(
        heftConfiguration.buildFolderPath,
        typeScriptConfigurationJson?.project || "./tsconfig.json"
      )
    );
  }
}
