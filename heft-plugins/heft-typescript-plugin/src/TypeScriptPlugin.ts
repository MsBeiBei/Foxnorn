import type { IHeftTaskPlugin, IHeftTaskSession } from "@rushstack/heft";

export const PLUGIN_NAME: "typescript-plugin" = "typescript-plugin";

export default class TypeScriptPlugin implements IHeftTaskPlugin {
  constructor() {}

  public apply(taskSession: IHeftTaskSession) {
    taskSession.hooks.run.tapPromise(PLUGIN_NAME, async () => {});
  }
}
