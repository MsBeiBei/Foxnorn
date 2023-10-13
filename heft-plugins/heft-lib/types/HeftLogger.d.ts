import { type ITerminal } from "@rushstack/node-core-library";
export interface IHeftLogger {
    log(message: any, ...param: any[]): void;
    error(message: any, ...param: any[]): void;
    debug(message: any, ...param: any[]): void;
    warn(message: any, ...param: any[]): void;
}
export declare class HeftLogger implements IHeftLogger {
    readonly terminal: ITerminal;
    constructor(terminal: ITerminal);
    log(message?: any, ...param: any[]): void;
    error(message?: any, ...param: any[]): void;
    warn(message?: any, ...param: any[]): void;
    debug(message?: any, ...param: any[]): void;
}
//# sourceMappingURL=HeftLogger.d.ts.map