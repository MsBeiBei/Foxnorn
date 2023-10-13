import { HeftPlugin } from "@foxnorn/heft-lib";

export const PLUGIN_NAME: "typescript-plugin" = "typescript-plugin";

export default class TypeScriptPlugin extends HeftPlugin {
  override PLUGIN_NAME: string = PLUGIN_NAME;
}
