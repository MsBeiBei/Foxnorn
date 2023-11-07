import { defineManifest } from "@crxjs/vite-plugin";
import packageJson from "./package.json";

export default defineManifest({
  manifest_version: 3,
  name: packageJson.name,
  version: packageJson.version,
  description: packageJson.description,
  permissions: [
    "storage",
    "background",
    "webRequest",
    "activeTab",
    "scripting",
  ],
  icons: {
    16: "assets/img/mspbots_transparent_16.png",
    48: "assets/img/mspbots_transparent_48.png",
    128: "assets/img/mspbots_transparent_128.png",
  },
  background: {
    service_worker: "background/index.ts",
    type: "module",
  },
  action: {
    default_popup: "popup/index.html",
  },
  options_ui: {
    page: "options/index.html",
    open_in_tab: true,
  },
  content_scripts: [
    {
      all_frames: true,
      matches: ["http://*/*", "https://*/*", "<all_urls>"],
      run_at: "document_start",
      js: ["content/index.ts"],
    },
  ],
});
