import { copyFile, mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import type { Plugin } from "vite";

function preserveLegacyAssets(): Plugin {
  let outputDirectory = "dist";

  return {
    name: "preserve-legacy-assets",
    configResolved(config) {
      outputDirectory = config.build.outDir;
    },
    async writeBundle() {
      const legacyOutput = resolve(import.meta.dirname, outputDirectory, "UI");
      const dataOutput = resolve(import.meta.dirname, outputDirectory, "data");
      await mkdir(legacyOutput, { recursive: true });
      await mkdir(dataOutput, { recursive: true });
      await Promise.all(
        ["support.js", "image-slot.js"].map((filename) =>
          copyFile(
            resolve(import.meta.dirname, "UI", filename),
            resolve(legacyOutput, filename),
          ),
        ),
      );
      await Promise.all(
        [
          "materials.json",
          "standardised_product_database_v3_enriched.json",
        ].map((filename) =>
          copyFile(
            resolve(import.meta.dirname, "data", filename),
            resolve(dataOutput, filename),
          ),
        ),
      );
    },
  };
}

export default defineConfig({
  plugins: [react(), preserveLegacyAssets()],
  server: {
    // Local image generation is served by `node dev-server.cjs` (port 3939),
    // which mirrors the Vercel /api/generate function with a mock fallback.
    proxy: {
      "/api": "http://localhost:3939",
    },
  },
  build: {
    rollupOptions: {
      input: {
        landing: resolve(import.meta.dirname, "index.html"),
        studio: resolve(import.meta.dirname, "studio/index.html"),
        legacy: resolve(import.meta.dirname, "UI/ReFleek.dc.html"),
      },
    },
  },
});
