import { defineConfig } from "vite";
import {
  CONTENT_PATH,
  PUBLIC_DIR,
  OUT_DIR,
  POPUP_PATH,
  SRC_DIR,
} from "./build/constants";
import { createPlugins } from "./build/plugins";

export default defineConfig(({ mode }) => {
  const isProd = mode === "production";
  const isDev = !isProd;

  return {
    root: SRC_DIR,
    public: PUBLIC_DIR,
    plugins: createPlugins(),
    esbuild: {
      drop: isProd ? ["console", "debugger"] : [],
    },
    optimizeDeps: {
      include: ["vue", "@vueuse/core"],
    },
    build: {
      emptyOutDir: true,
      outDir: OUT_DIR,
      modulePreload: false,
      minify: isProd,
      reportCompressedSize: isProd,
      rollupOptions: {
        input: {
          content: CONTENT_PATH,
          popup: POPUP_PATH,
        },
        output: {
          entryFileNames: "[name]/index.js",
          chunkFileNames: !isDev
            ? "assets/js/[name].js"
            : "assets/js/[name].[hash].js",
          manualChunks: {
            vue: ["vue"],
          },
        },
      },
    },
  };
});
