import { type PluginOption } from "vite";
import Vue from "@vitejs/plugin-vue";
import Jsx from "@vitejs/plugin-vue-jsx";
import { dynamic } from "./dynamic";

export function createPlugins(): PluginOption[] {
  const plugins: PluginOption[] = [Vue(), Jsx()];

  plugins.push(dynamic());

  return plugins;
}
