import { HeftVitePlugin } from "./HeftVitePlugin";

export const PLUGIN_NAME: "vite-plugin" = "vite-plugin";

export default class VitePlugin extends HeftVitePlugin {
  override PLUGIN_NAME: string = PLUGIN_NAME;

  override async run() {}
}
