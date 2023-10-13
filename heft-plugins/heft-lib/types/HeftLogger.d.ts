import type { IScopedLogger } from "@rushstack/heft";
import { type ITerminal } from "@rushstack/node-core-library";
export interface IHeftLogger {
    scopedLogger: Readonly<IScopedLogger>;
    terminal: Readonly<ITerminal>;
    log(message: any, ...param: any[]): void;
    error(message: any, ...param: any[]): void;
    debug(message: any, ...param: any[]): void;
    warn(message: any, ...param: any[]): void;
}
export declare class HeftLogger implements IHeftLogger {
    readonly scopedLogger: IScopedLogger;
    readonly terminal: ITerminal;
    constructor(scopedLogger: IScopedLogger);
    log(message?: any, ...param: any[]): void;
    error(message?: any, ...param: any[]): void;
    warn(message?: any, ...param: any[]): void;
    debug(message?: any, ...param: any[]): void;
}
//# sourceMappingURL=HeftLogger.d.ts.map