import {
  type IHeftTaskPlugin,
  type IHeftTaskSession,
  type HeftConfiguration,
  type IHeftTaskRunIncrementalHookOptions,
  type IHeftTaskFileOperations,
} from "@rushstack/heft";
import { HeftLogger, type ILogger } from "./HeftLogger";

export abstract class HeftPlugin<TState, TOptions = void>
  implements IHeftTaskPlugin<TOptions>
{
  protected declare readonly state: Readonly<TState & { options: TOptions }>;

  abstract readonly PLUGIN_NAME: string;

  protected logger!: ILogger;

  apply(
    taskSession: IHeftTaskSession,
    heftConfiguration: HeftConfiguration
  ): void {
    this.logger = new HeftLogger(taskSession.logger.terminal);

    if (this.register) {
      taskSession.hooks.registerFileOperations.tapPromise(
        this.PLUGIN_NAME,
        async (
          fileOperations: IHeftTaskFileOperations
        ): Promise<IHeftTaskFileOperations> => {
          return await this.register!(
            taskSession,
            heftConfiguration,
            fileOperations
          );
        }
      );
    }

    if (this.run) {
      taskSession.hooks.run.tapPromise(this.PLUGIN_NAME, async () => {
        await this.run!(taskSession, heftConfiguration);
      });
    }

    if (this.watch) {
      taskSession.hooks.runIncremental.tapPromise(
        this.PLUGIN_NAME,
        async (runIncrementalOptions: IHeftTaskRunIncrementalHookOptions) => {
          await this.watch!(
            taskSession,
            heftConfiguration,
            runIncrementalOptions
          );
        }
      );
    }
  }

  register?(
    taskSession: IHeftTaskSession,
    heftConfiguration: HeftConfiguration,
    fileOperations: IHeftTaskFileOperations
  ): Promise<IHeftTaskFileOperations>;

  run?(
    taskSession: IHeftTaskSession,
    heftConfiguration: HeftConfiguration
  ): Promise<void>;

  watch?(
    taskSession: IHeftTaskSession,
    heftConfiguration: HeftConfiguration,
    runIncrementalOptions: IHeftTaskRunIncrementalHookOptions
  ): Promise<void>;
}
