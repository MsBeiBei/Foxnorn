import type TTypeScript from "typescript";
export type ExtendedTypeScript = typeof TTypeScript & {
    performance: Performance;
};
export interface Performance {
    mark(name: string): void;
    measure(name: string, startMark?: string, endMark?: string): void;
    clearMeasures(name?: string): void;
    clearMarks(name?: string): void;
    now(): number;
    timeOrigin: number;
}
export declare class TypeScriptCore {
    readonly ts: ExtendedTypeScript;
    constructor(ts: ExtendedTypeScript);
    createCompilerHost(command: TTypeScript.ParsedCommandLine, system?: TTypeScript.System): TTypeScript.CompilerHost | undefined;
    private measurePerformance;
}
//# sourceMappingURL=TypeScriptCore.d.ts.map