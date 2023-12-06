import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import jsx from "@vitejs/plugin-vue-jsx";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";

export default defineConfig({
  resolve: {
    extensions: [".ts", ".tsx", ".json", ".less"],
  },
  plugins: [vue(), jsx(), vanillaExtractPlugin()],
  server: {
    port: 3001,
    host: true,
  },
  base: `/vite/`,
});
