import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import jsx from "@vitejs/plugin-vue-jsx";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";

export default defineConfig(({ mode }) => {
  const viteEnv = loadEnv(mode, process.cwd()) as unknown as Env.ImportMeta;

  return {
    base: viteEnv.VITE_BASE_URL,
    resolve: {
      extensions: [".ts", ".tsx", ".json", ".less"],
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    plugins: [vue(), jsx(), vanillaExtractPlugin()],
    server: {
      host: "0.0.0.0",
      port: 9527,
    },
  };
});
