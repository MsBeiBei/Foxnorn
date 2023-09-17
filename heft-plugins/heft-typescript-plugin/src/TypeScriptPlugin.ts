import { resolve } from "path";
import type {
  IHeftTaskPlugin,
  IHeftTaskSession,
  HeftConfiguration,
} from "@rushstack/heft";
import { Path, type ITerminal } from "@rushstack/node-core-library";
import {
  ConfigurationFile,
  InheritanceType,
} from "@rushstack/heft-config-file";
import {
  TypeScriptBuilder,
  type ITypeScriptBuilderConfiguration,
} from "./TypeScriptBuilder";

export const PLUGIN_NAME: "typescript-plugin" = "typescript-plugin";

export interface ITypeScriptConfigurationJson {
  project?: string;
  staticAssetsToCopy?: any;
}

const typeScriptConfigurationFilePromiseCache = new Map<
  string,
  Promise<ITypeScriptConfigurationJson | undefined>
>();
let typeScriptConfigurationFileLoader:
  | ConfigurationFile<ITypeScriptConfigurationJson>
  | undefined;

export async function loadTypeScriptConfigurationFileAsync(
  heftConfiguration: HeftConfiguration,
  terminal: ITerminal
): Promise<ITypeScriptConfigurationJson | undefined> {
  const buildFolderPath: string = heftConfiguration.buildFolderPath;

  if (typeScriptConfigurationFilePromiseCache.has(buildFolderPath)) {
    return typeScriptConfigurationFilePromiseCache.get(buildFolderPath);
  }

  if (!typeScriptConfigurationFileLoader) {
    const schemaPath: string = resolve(
      __dirname,
      `schemas/typescript.schema.json`
    );

    typeScriptConfigurationFileLoader =
      new ConfigurationFile<ITypeScriptConfigurationJson>({
        projectRelativeFilePath: "config/typescript.json",
        jsonSchemaPath: schemaPath,
        propertyInheritance: {
          staticAssetsToCopy: {
            inheritanceType: InheritanceType.merge,
          },
        },
      });
  }

  const typescriptConfigurationFilePromise =
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

export function getTsconfigFilePath(
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

export default class TypeScriptPlugin implements IHeftTaskPlugin {
  public apply(
    taskSession: IHeftTaskSession,
    heftConfiguration: HeftConfiguration
  ) {
    taskSession.hooks.run.tapPromise(PLUGIN_NAME, async () => {
      const builder: TypeScriptBuilder | undefined =
        await this.getTypeScriptBuilderAsync(taskSession, heftConfiguration);

      if (builder) {
        await builder.invokeAsync();
      }
    });
  }

  private async getTypeScriptBuilderAsync(
    taskSession: IHeftTaskSession,
    heftConfiguration: HeftConfiguration
  ): Promise<TypeScriptBuilder | undefined> {
    const terminal: ITerminal = taskSession.logger.terminal;

    const typeScriptConfigurationJson:
      | ITypeScriptConfigurationJson
      | undefined = await loadTypeScriptConfigurationFileAsync(
      heftConfiguration,
      terminal
    );

    const typeScriptToolPath: string =
      await heftConfiguration.rigPackageResolver.resolvePackageAsync(
        "typescript",
        terminal
      );

    const typeScriptBuilderConfiguration: ITypeScriptBuilderConfiguration = {
      typeScriptToolPath,
      scopedLogger: taskSession.logger,
      tsconfigPath: getTsconfigFilePath(
        heftConfiguration,
        typeScriptConfigurationJson
      ),
    };

    const typeScriptBuilder: TypeScriptBuilder = new TypeScriptBuilder(
      typeScriptBuilderConfiguration
    );

    return typeScriptBuilder;
  }
}
