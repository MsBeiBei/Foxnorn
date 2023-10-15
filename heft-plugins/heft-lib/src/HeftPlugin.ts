import type {
  IHeftTaskPlugin,
  IHeftTaskSession,
  HeftConfiguration,
} from "@rushstack/heft";
import { HeftLogger } from "./HeftLogger";

export abstract class HeftPlugin implements IHeftTaskPlugin {
  abstract readonly PLUGIN_NAME: string;

  public heftLogger!: HeftLogger;

  public run?(
    taskSession: IHeftTaskSession,
    heftConfiguration: HeftConfiguration
  ): Promise<void>;

  public apply(
    taskSession: IHeftTaskSession,
    heftConfiguration: HeftConfiguration
  ): void {
    this.heftLogger = new HeftLogger(taskSession);

    if (this.run) {
      taskSession.hooks.run.tapPromise(this.PLUGIN_NAME, async () => {
        await this.run!(taskSession, heftConfiguration);
      });
    }
  }
}
