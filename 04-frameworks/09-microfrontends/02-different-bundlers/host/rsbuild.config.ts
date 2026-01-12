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
        mfe2: "mfe2@http://localhost:8082/mf-manifest.json",
      },
      shared: {
        react: {
          version: "19.2.3",
          singleton: true,
          eager: true,
          requiredVersion: "^19.2.3",
        },
      },
    }),
  ],
  server: {
    port: 8080,
  },
});
