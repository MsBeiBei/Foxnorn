import { format } from "util";
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

export class HeftLogger implements IHeftLogger {
  public readonly scopedLogger: IScopedLogger;
  public readonly terminal: ITerminal;

  public constructor(scopedLogger: IScopedLogger) {
    this.scopedLogger = scopedLogger;
    this.terminal = scopedLogger.terminal;
  }

  public log(message?: any, ...param: any[]): void {
    this.terminal.writeLine(format(message, ...param));
  }

  public error(message?: any, ...param: any[]): void {
    this.terminal.writeErrorLine(format(message, ...param));
  }

  public warn(message?: any, ...param: any[]): void {
    this.terminal.writeWarningLine(format(message, ...param));
  }

  public debug(message?: any, ...param: any[]): void {
    this.terminal.writeVerboseLine(format(message, ...param));
  }
}
