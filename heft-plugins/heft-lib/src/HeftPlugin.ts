import type {
  IHeftTaskPlugin,
  IHeftTaskSession,
  HeftConfiguration,
} from "@rushstack/heft";

export abstract class HeftPlugin<TState, TOptions = void>
  implements IHeftTaskPlugin<TOptions>
{
  protected declare readonly state: Readonly<
    TState & { pluginOptions: TOptions }
  >;

  abstract readonly PLUGIN_NAME: string;

  public run?(
    taskSession: IHeftTaskSession,
    heftConfiguration: HeftConfiguration
  ): Promise<void>;

  public apply(
    taskSession: IHeftTaskSession,
    heftConfiguration: HeftConfiguration,
    pluginOptions: TOptions
  ): void {
    if (this.run) {
      taskSession.hooks.run.tapPromise(this.PLUGIN_NAME, async () => {
        if (!this.state) {
          Object.assign(this, { state: { pluginOptions } });
        }

        await this.run!(taskSession, heftConfiguration);
      });
    }
  }
}
