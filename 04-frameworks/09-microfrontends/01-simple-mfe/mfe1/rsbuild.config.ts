import { pluginModuleFederation } from "@module-federation/rsbuild-plugin";
import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

export default defineConfig({
  plugins: [
    pluginReact(),
    pluginModuleFederation({
      name: "mfe1",
      exposes: {
        "./app": "./src/app.expose.ts",
        "./helpers": "./src/helpers.ts",
      },
      shared: {
        react: {
          version: "19.2.3",
          singleton: true,
          requiredVersion: "^19.2.3",
        },
      },
    }),
  ],
  server: {
    port: 8081,
  },
});
