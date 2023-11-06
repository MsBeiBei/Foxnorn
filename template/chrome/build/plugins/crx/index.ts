import { type PluginOption } from "vite";

export function crx(): PluginOption {
  return {
    name: "vite-plugin-crx",
    renderDynamicImport() {
      return {
        left: "import(",
        right: ")",
      };
    },
  };
}
