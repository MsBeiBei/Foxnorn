import { type PluginOption } from "vite";
import Vue from "@vitejs/plugin-vue";
import Jsx from "@vitejs/plugin-vue-jsx";
import { crx } from "@crxjs/vite-plugin";
import manifest from "../../manifest.config";

export function createPlugins(): PluginOption[] {
  const plugins: PluginOption[] = [Vue(), Jsx()];

  plugins.push(crx({ manifest }));

  return plugins;
}
