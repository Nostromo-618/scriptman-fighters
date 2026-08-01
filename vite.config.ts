import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";

const BASE = process.env.VITE_BASE ?? "/scriptman-fighters/";

// `vite preview` uses command "serve" (same as `vite`/`vite dev`), but the
// production HTML is built with BASE. Preview must use the same base or asset
// requests under /scriptman-fighters/assets/* fall through to index.html.
const isPreview = process.argv.includes("preview");

export default defineConfig(({ command }) => ({
  base: command === "build" || isPreview ? BASE : "/",
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    dedupe: ["vue"],
  },
  worker: {
    format: "es",
  },
  build: {
    target: "es2020",
  },
}));
