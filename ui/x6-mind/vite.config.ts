import { resolve } from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import jsx from "@vitejs/plugin-vue-jsx";
import uno from "unocss/vite";

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
  css: {
    preprocessorOptions: {
      less: {
        additionalData: '@import "./src/styles/variables.module.less";',
        javascriptEnabled: true
      }
    }
  },
  plugins: [vue(), jsx(), uno()],
});
