import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://54.66.153.95:8080",
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir:
      "C:/Users/Noh Kyung Hyun/IdeaProjects/Back-End/HomeWorryParty/src/main/webapp/resources", // 백엔드 webapp/resources 경로
  },
});
