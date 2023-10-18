import { dirname } from "path";
import type TTypeScript from "typescript";
import { type HeftLogger } from "@foxnorn/heft-lib";
import { type ExtendedTypeScript, type Measure } from "./types/typescript";
import { TypeScriptCore } from "./TypeScriptCore";

export interface ITypeScriptBuilderConfiguration {
  buildFolderPath: string;
  typeScriptToolPath: string;
  tsconfigPath: string;
  heftLogger: HeftLogger;
}

export interface ITypeScriptTool {
  ts: ExtendedTypeScript;
  system: TTypeScript.System;
  measure: Measure;
}

export class TypeScriptBuilder {
  private tool?: ITypeScriptTool = undefined;

  constructor(
    private readonly configuration: ITypeScriptBuilderConfiguration
  ) {}

  public async invokeAsync(): Promise<void> {
    const ts: ExtendedTypeScript = require(this.configuration
      .typeScriptToolPath);

    ts.performance.enable();

    const system: TTypeScript.System = {
      ...ts.sys,
    };

    const measure: Measure = <T extends object | void>(
      measureName: string,
      fn: () => T
    ) => {
      const startMarkName = `before${measureName}`;
      ts.performance.mark(startMarkName);
      const result: T = fn();
      const endMarkName = `after${measureName}`;
      ts.performance.mark(endMarkName);
      ts.performance.measure(measureName, startMarkName, endMarkName);

      return {
        ...result,
        duration: ts.performance.getDuration(measureName),
        count: ts.performance.getCount(startMarkName),
      };
    };

    this.tool = {
      ts,
      system,
      measure,
    };

    ts.performance.disable();
    ts.performance.enable();

    await this.compile(this.tool);
  }

  public compile(tool: ITypeScriptTool) {
    const { ts, measure } = tool;

    const { tsconfig } = measure("Configure", () => {
      const tsconfig: TTypeScript.ParsedCommandLine = this.loadTsconfigFile(ts);

      return {
        tsconfig,
      };
    });


    ts.performance.disable();
    ts.performance.enable();
  }

  private loadTsconfigFile(
    ts: ExtendedTypeScript
  ): TTypeScript.ParsedCommandLine {
    const readResult = ts.readConfigFile(
      this.configuration.tsconfigPath,
      ts.sys.readFile
    );

    const basePath: string = dirname(this.configuration.tsconfigPath);

    const tsconfig: TTypeScript.ParsedCommandLine =
      ts.parseJsonConfigFileContent(
        readResult.config,
        {
          fileExists: ts.sys.fileExists,
          readFile: ts.sys.readFile,
          readDirectory: ts.sys.readDirectory,
          useCaseSensitiveFileNames: true,
        },
        basePath,
        undefined,
        this.configuration.tsconfigPath
      );

    return tsconfig;
  }
}
