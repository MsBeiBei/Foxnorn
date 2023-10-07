import type {
  IHeftTaskPlugin,
  IHeftTaskSession,
  HeftConfiguration,
  IHeftTaskRunIncrementalHookOptions,
} from "@rushstack/heft";
import { HeftLogger } from "./HeftLogger";

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

    if (this.runIncremental) {
      taskSession.hooks.runIncremental.tapPromise(
        this.PLUGIN_NAME,
        async (
          taskRunIncrementalHookOptions: IHeftTaskRunIncrementalHookOptions
        ) => {
          await this.runIncremental!(
            taskSession,
            heftConfiguration,
            taskRunIncrementalHookOptions
          );
        }
      );
    }
  }

  public run?(
    taskSession: IHeftTaskSession,
    heftConfiguration: HeftConfiguration
  ): Promise<void>;

  public runIncremental?(
    session: IHeftTaskSession,
    configuration: HeftConfiguration,
    watchOptions: IHeftTaskRunIncrementalHookOptions
  ): Promise<void>;
}
