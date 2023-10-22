import type {
  IHeftTaskPlugin,
  IHeftTaskSession,
  HeftConfiguration,
} from "@rushstack/heft";

export abstract class HeftPlugin<TOptions = void>
  implements IHeftTaskPlugin<TOptions>
{
  abstract readonly PLUGIN_NAME: string;

  public run?(
    taskSession: IHeftTaskSession,
    heftConfiguration: HeftConfiguration
  ): Promise<void>;

  public apply(
    taskSession: IHeftTaskSession,
    heftConfiguration: HeftConfiguration
  ): void {
    if (this.run) {
      taskSession.hooks.run.tapPromise(this.PLUGIN_NAME, async () => {
        await this.run!(taskSession, heftConfiguration);
      });
    }
  }
}
