import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { seedDesignPlugin } from "@seed-design/vite-plugin";
import { resolve } from "node:path";

// base "./" keeps asset paths relative, so the build works under a GitHub Pages sub-path.
export default defineConfig({
  base: "./",
  plugins: [react(), seedDesignPlugin({ colorMode: "light-only" })],
  resolve: { tsconfigPaths: true },
  build: {
    rollupOptions: {
      input: {
        index: resolve(import.meta.dirname, "index.html"),
        detail: resolve(import.meta.dirname, "detail.html"),
      },
    },
  },
});
