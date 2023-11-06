import { type PluginOption } from "vite";

export function dynamic(): PluginOption {
  return {
    name: "vite-plugin-dynamic-import",
    renderDynamicImport() {
      console.log(12321);

      return {
        left: "import(",
        right: ")",
      };
    },
  };
}
