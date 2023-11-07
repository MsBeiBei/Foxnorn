import { defineConfig } from "vite";
import { PUBLIC_DIR, OUT_DIR, SRC_DIR, TYPES_DIR } from "./build/constants";
import { createPlugins } from "./build/plugins";

export default defineConfig(({ mode }) => {
  const isProd = mode === "production";
  const isDev = !isProd;

  return {
    root: SRC_DIR,
    public: PUBLIC_DIR,
    resolve: {
      extensions: [".ts", ".tsx", ".json"],
      alias: {
        "@": SRC_DIR,
        "#": TYPES_DIR,
      },
    },
    plugins: createPlugins(),
    esbuild: {
      drop: isProd ? ["console", "debugger"] : [],
    },
    optimizeDeps: {
      include: ["vue"],
    },
    build: {
      emptyOutDir: true,
      outDir: OUT_DIR,
      modulePreload: false,
      minify: isProd,
      reportCompressedSize: isProd,
      rollupOptions: {
        output: {
          entryFileNames: "[name]/index.js",
          chunkFileNames: "assets/js/[name].[hash].js",
          assetFileNames: `assets/[ext]/[name].[hash].[ext]`,
          manualChunks: {
            vue: ["vue"],
          },
        },
      },
    },
  };
});
