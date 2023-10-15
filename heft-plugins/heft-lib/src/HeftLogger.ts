import { format } from "util";
import type { IHeftTaskSession, IScopedLogger } from "@rushstack/heft";
import type { ITerminal } from "@rushstack/node-core-library";

export interface IHeftLogger {
  log(message: any, ...param: any[]): void;
  error(message: any, ...param: any[]): void;
  debug(message: any, ...param: any[]): void;
  warn(message: any, ...param: any[]): void;
}

export class HeftLogger implements IHeftLogger {
  public get terminal(): ITerminal {
    return this.taskSession.logger.terminal;
  }
  public get logger(): IScopedLogger {
    return this.taskSession.logger;
  }

  constructor(public readonly taskSession: IHeftTaskSession) {}

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
