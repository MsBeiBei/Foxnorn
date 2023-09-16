import { type IHeftTaskPlugin, type IHeftTaskSession } from "@rushstack/heft";

const PLUGIN_NAME: "checkup-plugin" = "checkup-plugin";

export default class StorybookPlugin implements IHeftTaskPlugin {
  public apply(taskSession: IHeftTaskSession): void {
    taskSession.hooks.run.tapPromise(PLUGIN_NAME, async () => {});
  }
}
