import { resolve } from "path";
import { type HeftConfiguration } from "@rushstack/heft";
import { type ITerminal } from "@rushstack/node-core-library";
import {
  ConfigurationFile,
  InheritanceType,
  type IConfigurationFileOptions,
} from "@rushstack/heft-config-file";

export interface IStaticAssetsCopyConfiguration {
  fileExtensions: string[];
  excludeGlobs: string[];
  includeGlobs: string[];
}

export interface ITypescriptConfigurationFile {
  staticAssetsToCopy?: IStaticAssetsCopyConfiguration;
}

const typescriptConfigurationFileCache = new Map<
  string,
  Promise<ITypescriptConfigurationFile | undefined>
>();

let typescriptConfigurationFileLoader:
  | ConfigurationFile<ITypescriptConfigurationFile>
  | undefined;

export async function loadTypescriptConfiguration(
  heftConfiguration: HeftConfiguration,
  terminal: ITerminal
): Promise<ITypescriptConfigurationFile | undefined> {
  const buildFolderPath: string = heftConfiguration.buildFolderPath;

  if (typescriptConfigurationFileCache.has(buildFolderPath)) {
    return await typescriptConfigurationFileCache.get(buildFolderPath);
  }

  if (!typescriptConfigurationFileLoader) {
    const schemaPath: string = resolve(
      __dirname,
      "../schemas/typescript.schema.json"
    );

    typescriptConfigurationFileLoader =
      new ConfigurationFile<ITypescriptConfigurationFile>({
        projectRelativeFilePath: "config/typescript.json",
        jsonSchemaPath: schemaPath,
        propertyInheritance: {
          inheritanceType: InheritanceType.merge,
        },
      } as IConfigurationFileOptions<ITypescriptConfigurationFile>);
  }

  const tsConfigFilePromise =
    typescriptConfigurationFileLoader.tryLoadConfigurationFileForProjectAsync(
      terminal,
      buildFolderPath,
      heftConfiguration.rigConfig
    );

  typescriptConfigurationFileCache.set(buildFolderPath, tsConfigFilePromise);

  return await tsConfigFilePromise;
}
