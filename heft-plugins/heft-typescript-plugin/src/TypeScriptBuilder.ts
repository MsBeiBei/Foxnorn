import { resolve, dirname } from "path";
import type TTypescript from "typescript";
import { parse, type SemVer } from "semver";
import type { HeftLogger } from "@foxnorn/heft-lib";
import { JsonFile, type IPackageJson } from "@rushstack/node-core-library";
import type { ITypeScriptConfigurationFile } from "./HeftTypeScriptPlugin";

const OLDEST_SUPPORTED_TS_MAJOR_VERSION: number = 2;
const OLDEST_SUPPORTED_TS_MINOR_VERSION: number = 9;

const NEWEST_SUPPORTED_TS_MAJOR_VERSION: number = 5;
const NEWEST_SUPPORTED_TS_MINOR_VERSION: number = 0;

export interface ITypeScriptBuilderConfiguration
  extends ITypeScriptConfigurationFile {
  buildFolderPath: string;

  tempFolderPath: string;

  typeScriptToolPath: string;

  tsconfigFilePath: string;

  heftLogger: HeftLogger;
}

interface ICompilerCapabilities {
  incrementalProgram: boolean;

  solutionBuilder: boolean;
}

export class TypeScriptBuilder {
  private readonly _configuration: ITypeScriptBuilderConfiguration;
  private readonly _heftLogger: HeftLogger;

  private _typeScriptVersion!: string;
  private _typeScriptParsedVersion!: SemVer;

  private _capabilities!: ICompilerCapabilities;
  private _useSolutionBuilder!: boolean;

  private readonly _suppressedDiagnosticCodes: Set<number> = new Set();

  private _tool: any;

  public constructor(configuration: ITypeScriptBuilderConfiguration) {
    this._configuration = configuration;
    this._heftLogger = configuration.heftLogger;
  }

  public async invokeAsync() {
    const packageJsonFilename = resolve(
      this._configuration.typeScriptToolPath,
      "package.json"
    );

    // 异步加载package.json
    const packageJson: IPackageJson = await JsonFile.loadAsync(
      packageJsonFilename
    );
    this._typeScriptVersion = packageJson.version;
    const parsedVersion: SemVer | null = parse(this._typeScriptVersion);
    if (!parsedVersion) {
      throw new Error(
        `Unable to parse version "${this._typeScriptVersion}" for TypeScript compiler package in: ` +
          packageJsonFilename
      );
    }

    this._typeScriptParsedVersion = parsedVersion;

    this._capabilities = {
      incrementalProgram: false,
      // 主版本 >=3
      solutionBuilder: this._typeScriptParsedVersion.major >= 3,
    };

    if (
      this._typeScriptParsedVersion.major > 3 ||
      (this._typeScriptParsedVersion.major === 3 &&
        this._typeScriptParsedVersion.minor >= 6)
    ) {
      this._capabilities.incrementalProgram = true;
    }

    this._useSolutionBuilder = !!this._configuration.buildProjectReferences;
    if (this._useSolutionBuilder && !this._capabilities.solutionBuilder) {
      throw new Error(
        `Building project references requires TypeScript@>=3.0, but the current version is ${this._typeScriptVersion}`
      );
    }

    if (
      this._typeScriptParsedVersion.major < OLDEST_SUPPORTED_TS_MAJOR_VERSION ||
      (this._typeScriptParsedVersion.major ===
        OLDEST_SUPPORTED_TS_MAJOR_VERSION &&
        this._typeScriptParsedVersion.minor < OLDEST_SUPPORTED_TS_MINOR_VERSION)
    ) {
      this._heftLogger.log(
        `The TypeScript compiler version ${this._typeScriptVersion} is very old` +
          ` and has not been tested with Heft; it may not work correctly.`
      );
    } else if (
      this._typeScriptParsedVersion.major > NEWEST_SUPPORTED_TS_MAJOR_VERSION ||
      (this._typeScriptParsedVersion.major ===
        NEWEST_SUPPORTED_TS_MAJOR_VERSION &&
        this._typeScriptParsedVersion.minor > NEWEST_SUPPORTED_TS_MINOR_VERSION)
    ) {
      this._heftLogger.log(
        `The TypeScript compiler version ${this._typeScriptVersion} is newer` +
          " than the latest version that was tested with Heft " +
          `(${NEWEST_SUPPORTED_TS_MAJOR_VERSION}.${NEWEST_SUPPORTED_TS_MINOR_VERSION}); it may not work correctly.`
      );
    }

    const ts: typeof TTypescript = require(this._configuration
      .typeScriptToolPath);

    (ts as any).performance.enable();

    const suppressedCodes: (number | undefined)[] = [
      (ts as any).Diagnostics
        .Property_0_has_no_initializer_and_is_not_definitely_assigned_in_the_constructor
        ?.code,
      (ts as any).Diagnostics
        .Element_implicitly_has_an_any_type_because_expression_of_type_0_can_t_be_used_to_index_type_1
        ?.code,
    ];

    for (const code of suppressedCodes) {
      if (code !== undefined) {
        this._suppressedDiagnosticCodes.add(code);
      }
    }

    this._tool = {
      ts,
    };

    this.runBuildAsync(this._tool);
  }

  public async runBuildAsync(tool: any) {
    const { ts } = tool;

    const tsconfig = this._loadTsconfig(ts);

    let compilerHost = ts.createCompilerHost(tsconfig.options, undefined);

    let innerProgram = ts.createProgram({
      rootNames: tsconfig.fileNames,
      options: tsconfig.options,
      projectReferences: tsconfig.projectReferences,
      host: compilerHost,
      oldProgram: undefined,
      configFileParsingDiagnostics:
        ts.getConfigFileParsingDiagnostics(tsconfig),
    });

    console.log(innerProgram.getCompilerOptions());

    innerProgram.emit(
      undefined,
      ts.sys.writeFile,
      undefined,
      undefined,
      undefined
    );
  }

  private _loadTsconfig(ts: any): any {
    const parsedConfigFile: any = ts.readConfigFile(
      this._configuration.tsconfigFilePath,
      ts.sys.readFile
    );
    const currentFolder: string = dirname(this._configuration.tsconfigFilePath);

    const tsconfig: TTypescript.ParsedCommandLine =
      ts.parseJsonConfigFileContent(
        parsedConfigFile.config,
        {
          fileExists: ts.sys.fileExists,
          readFile: ts.sys.readFile,
          readDirectory: ts.sys.readDirectory,
          useCaseSensitiveFileNames: true,
        },
        currentFolder,
        undefined,
        this._configuration.tsconfigFilePath
      );

    return tsconfig;
  }
}
