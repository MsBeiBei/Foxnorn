import type TTypeScript from "typescript";
export type ExtendedTypeScript = typeof TTypeScript;
export declare class TypeScriptCore {
    readonly ts: ExtendedTypeScript;
    constructor(ts: ExtendedTypeScript);
    createCompilerHost(command: TTypeScript.ParsedCommandLine, system?: TTypeScript.System): TTypeScript.CompilerHost | undefined;
}
//# sourceMappingURL=TypeScriptCore.d.ts.map