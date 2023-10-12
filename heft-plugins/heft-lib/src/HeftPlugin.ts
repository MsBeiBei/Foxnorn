import type {
  IHeftTaskPlugin,
  IHeftTaskSession,
  HeftConfiguration,
} from "@rushstack/heft";
import { HeftLogger } from "./HeftLogger.js";

export abstract class HeftPlugin implements IHeftTaskPlugin {
  abstract readonly PLUGIN_NAME: string;

  protected heftLogger!: HeftLogger;

  public apply(
    taskSession: IHeftTaskSession,
    heftConfiguration: HeftConfiguration
  ): void {
    this.heftLogger = new HeftLogger(taskSession.logger);

    if (this.run) {
      taskSession.hooks.run.tapPromise(this.PLUGIN_NAME, async () => {
        await this.run!(taskSession, heftConfiguration);
      });
    }
  }

  public run?(
    taskSession: IHeftTaskSession,
    heftConfiguration: HeftConfiguration
  ): Promise<void>;
}
