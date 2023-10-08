import { resolve } from "path";
import { type CompilerOptions } from "typescript";
import type { HeftConfiguration, IHeftTaskSession } from "@rushstack/heft";
import { ConfigurationFile } from "@rushstack/heft-config-file";
import { FileSystem, Path, type ITerminal } from "@rushstack/node-core-library";
import { HeftPlugin } from "@foxnorn/heft-lib";

export interface ITypeScriptConfigurationFile {
  project?: string;
}

export interface ITsconfigFile {
  compilerOptions?: CompilerOptions;
}

const typescriptConfigurationFilePromiseCache: Map<
  string,
  Promise<ITypeScriptConfigurationFile | undefined>
> = new Map();

let typeScriptConfigurationFileLoader:
  | ConfigurationFile<ITypeScriptConfigurationFile>
  | undefined;

const tsconfigFilePromiseCache: Map<
  string,
  Promise<ITsconfigFile | undefined>
> = new Map();
let tsconfigFileLoader: ConfigurationFile<ITsconfigFile> | undefined;

export abstract class HeftTypeScriptPlugin extends HeftPlugin {
  protected async loadTypeScriptConfigurationFileAsync(
    taskSession: IHeftTaskSession,
    heftConfiguration: HeftConfiguration
  ): Promise<ITypeScriptConfigurationFile | undefined> {
    // 项目构建文件夹路径
    const buildFolderPath: string = heftConfiguration.buildFolderPath;

    // 已经解析过配置文件使用缓存
    let typescriptConfigurationFilePromise:
      | Promise<ITypeScriptConfigurationFile | undefined>
      | undefined =
      typescriptConfigurationFilePromiseCache.get(buildFolderPath);

    if (typescriptConfigurationFilePromise) {
      return await typescriptConfigurationFilePromise;
    }

    // 用于将消息写入控制台的终端
    const terminal: ITerminal = taskSession.logger.terminal;

    if (!typeScriptConfigurationFileLoader) {
      // 定义 TypeScript 构建的可选选项的配置路径
      const typeScriptSchemaFolderPath: string = resolve(
        __dirname,
        `schemas/typescript.schema.json`
      );

      typeScriptConfigurationFileLoader =
        new ConfigurationFile<ITypeScriptConfigurationFile>({
          projectRelativeFilePath: "config/typescript.json",
          jsonSchemaPath: typeScriptSchemaFolderPath,
          propertyInheritance: {},
        });
    }

    // 返回指定项目的配置文件，自动解析
    typescriptConfigurationFilePromise =
      typeScriptConfigurationFileLoader.tryLoadConfigurationFileForProjectAsync(
        terminal,
        buildFolderPath,
        heftConfiguration.rigConfig
      );

    typescriptConfigurationFilePromiseCache.set(
      buildFolderPath,
      typescriptConfigurationFilePromise
    );

    return await typescriptConfigurationFilePromise;
  }

  protected async loadTsconfigFileAsync(
    taskSession: IHeftTaskSession,
    heftConfiguration: HeftConfiguration,
    typeScriptConfigurationFile: ITypeScriptConfigurationFile | undefined
  ): Promise<ITsconfigFile | undefined> {
    // 项目构建文件夹路径
    const buildFolderPath: string = heftConfiguration.buildFolderPath;

    let tsconfigFilePromise: Promise<ITsconfigFile | undefined> | undefined =
      tsconfigFilePromiseCache.get(buildFolderPath);

    if (tsconfigFilePromise) {
      return await tsconfigFilePromise;
    }

    // 用于将消息写入控制台的终端
    const terminal: ITerminal = taskSession.logger.terminal;

    const tsconfigFilePath: string = await this.getTsconfigFilePath(
      heftConfiguration,
      typeScriptConfigurationFile
    );

    this.heftLogger.debug(`Looking for tsconfig at ${tsconfigFilePath}`);

    const tsconfigExists: boolean = await FileSystem.existsAsync(
      tsconfigFilePath
    );

    // 如果不存在tsconfig.json,则不去尝试解析配置
    if (!tsconfigExists) {
      return Promise.resolve(undefined);
    }

    if (!tsconfigFileLoader) {
      //  定义 tsconfig 构建的可选选项的配置路径
      const tsconfigSchemaFolderPath: string = resolve(
        __dirname,
        `schemas/tsconfig.schema.json`
      );

      tsconfigFileLoader = new ConfigurationFile<ITsconfigFile>({
        projectRelativeFilePath:
          typeScriptConfigurationFile?.project || "tsconfig.json",
        jsonSchemaPath: tsconfigSchemaFolderPath,
      });
    }

    tsconfigFilePromise =
      tsconfigFileLoader.loadConfigurationFileForProjectAsync(
        terminal,
        buildFolderPath,
        heftConfiguration.rigConfig
      );

    tsconfigFilePromiseCache.set(buildFolderPath, tsconfigFilePromise);

    return await tsconfigFilePromise;
  }

  // 获取tsconfig.json的路径
  protected async getTsconfigFilePath(
    heftConfiguration: HeftConfiguration,
    typeScriptConfigurationFile?: ITypeScriptConfigurationFile
  ): Promise<string> {
    return Path.convertToSlashes(
      resolve(
        heftConfiguration.buildFolderPath,
        typeScriptConfigurationFile?.project || "tsconfig.json"
      )
    );
  }

  protected async getTypeScriptToolPath(
    taskSession: IHeftTaskSession,
    heftConfiguration: HeftConfiguration
  ): Promise<string> {
    const terminal: ITerminal = taskSession.logger.terminal;

    const typeScriptToolPath =
      await heftConfiguration.rigPackageResolver.resolvePackageAsync(
        "typescript",
        terminal
      );

    return typeScriptToolPath;
  }
}
