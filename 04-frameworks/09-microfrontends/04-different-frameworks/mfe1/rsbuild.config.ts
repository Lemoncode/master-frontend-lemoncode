import { pluginModuleFederation } from "@module-federation/rsbuild-plugin";
import { defineConfig } from "@rsbuild/core";
import { pluginVue } from "@rsbuild/plugin-vue";

export default defineConfig({
  plugins: [
    pluginVue(),
    pluginModuleFederation({
      name: "mfe1",
      exposes: {
        "./app": "./src/app.vue",
      },
      shared: {
        vue: {
          version: "3.5.26",
          singleton: true,
          requiredVersion: "^3.5.26",
        },
      },
    }),
  ],
  server: {
    port: 8081,
  },
});
