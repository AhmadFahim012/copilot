import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  build: {
    minify: true,
    rollupOptions: {
      input: "src/main.tsx",
      output: {
        name: "copilot",
        dir: "dist",
        entryFileNames: "copilot.js",
        assetFileNames: (assetInfo) => {
          // Handle font files
          if (assetInfo.name && /\.(ttf|otf|woff|woff2)$/.test(assetInfo.name)) {
            return 'fonts/[name].[ext]';
          }
          return 'assets/[name].[hash].[ext]';
        },
      },
    },
    // Copy public fonts to dist
    copyPublicDir: true,
  },
  // Ensure fonts are served correctly during development
  publicDir: 'public',
});
