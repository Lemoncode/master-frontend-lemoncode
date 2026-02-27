import { pluginModuleFederation } from "@module-federation/rsbuild-plugin";
import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

export default defineConfig({
  plugins: [
    pluginReact(),
    pluginModuleFederation({
      name: "host",
      remotes: {
        mfe1: "mfe1@http://localhost:8081/mf-manifest.json",
      },
      shared: {
        react: {
          version: "19.2.3",
          singleton: true,
          requiredVersion: "^19.2.3",
        },
        vue: {
          version: "3.5.26",
          singleton: true,
          requiredVersion: "^3.5.26",
        },
      },
    }),
  ],
  server: {
    port: 8080,
  },
});
