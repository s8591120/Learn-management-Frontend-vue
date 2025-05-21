import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "node:path";

const isProduction = process.env.NODE_ENV === "production";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },

  server: {
    proxy: !isProduction
      ? {
          "/api": {
            target: "http:localhost:8080", //本地地址
            secure: false,
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ""),
          },
        }
      : undefined,
  },

  define: {
    __API_BASE_URL__: isProduction
      ? JSON.stringify("https://lms-backend-4q3j.onrender.com")
      : JSON.stringify("/api"),
  },
});
