import { resolve } from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import jsx from "@vitejs/plugin-vue-jsx";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";

const root = process.cwd();

function pathResolve(dir: string) {
  return resolve(root, ".", dir);
}

export default defineConfig({
  resolve: {
    extensions: [".ts", ".tsx", ".json", ".less"],
    alias: [
      {
        find: /\@\//,
        replacement: `${pathResolve("src")}/`,
      },
    ],
  },
  plugins: [vue(), jsx(), vanillaExtractPlugin()],
});
