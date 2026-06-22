import { federation } from "@module-federation/vite";
import pluginReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    pluginReact(),
    federation({
      name: "mfe2",
      manifest: true,
      filename: "mfe2.js",
      exposes: {
        "./app": "./src/app.expose.ts",
      },
      shared: {
        react: {
          version: "19.2.7",
          singleton: true,
          requiredVersion: "^19.2.7",
        },
      },
    }),
  ],
  server: {
    port: 8082,
  },
});
