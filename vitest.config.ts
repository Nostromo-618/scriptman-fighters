import { defineConfig } from "vitest/config";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["tests/unit/**/*.spec.ts"],
    coverage: {
      provider: "v8",
      include: ["src/services/**", "src/utils/**"],
      reporter: ["text", "html"],
    },
  },
});
